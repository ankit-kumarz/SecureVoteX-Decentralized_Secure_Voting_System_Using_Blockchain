const db = require('../models/db');

/**
 * Get election statistics
 */
const getElectionStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    const { range = '24h' } = req.query;

    // Calculate time range
    const timeRanges = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      'all': null
    };
    const rangeMs = timeRanges[range];
    const startTime = rangeMs ? new Date(Date.now() - rangeMs) : null;

    // Get total votes for this election
    const voteQuery = startTime
      ? 'SELECT COUNT(*) as count FROM votes WHERE election_id = $1 AND voted_at >= $2'
      : 'SELECT COUNT(*) as count FROM votes WHERE election_id = $1';
    const voteParams = startTime ? [id, startTime] : [id];
    const totalVotesResult = await db.query(voteQuery, voteParams);
    const totalVotes = parseInt(totalVotesResult.rows[0].count);

    // Get encrypted votes count
    const encryptedVotesResult = await db.query(
      'SELECT COUNT(*) as count FROM votes WHERE election_id = $1 AND encrypted_vote IS NOT NULL',
      [id]
    );
    const encryptedVotes = parseInt(encryptedVotesResult.rows[0].count);

    // Get total eligible voters (assuming all voters are eligible)
    const eligibleVotersResult = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'voter'"
    );
    const totalEligibleVoters = parseInt(eligibleVotersResult.rows[0].count);

    // Get votes by candidate
    const candidateVotesResult = await db.query(
      `SELECT c.name, c.party, COUNT(v.id) as votes
       FROM candidates c
       LEFT JOIN votes v ON c.id = v.candidate_id
       WHERE c.election_id = $1
       GROUP BY c.id, c.name, c.party
       ORDER BY votes DESC`,
      [id]
    );
    const candidateVotes = candidateVotesResult.rows.map(row => ({
      name: row.name,
      party: row.party,
      votes: parseInt(row.votes)
    }));

    // Get hourly voting trend (last 24 hours)
    const hourlyTrendResult = await db.query(
      `SELECT 
        TO_CHAR(voted_at, 'HH24:00') as hour,
        COUNT(*) as count
       FROM votes
       WHERE election_id = $1 AND voted_at >= NOW() - INTERVAL '24 hours'
       GROUP BY hour
       ORDER BY hour`,
      [id]
    );
    const hourlyTrend = hourlyTrendResult.rows.map(row => ({
      hour: row.hour,
      count: parseInt(row.count)
    }));

    res.json({
      totalVotes,
      encryptedVotes,
      totalEligibleVoters,
      candidateVotes,
      hourlyTrend
    });
  } catch (err) {
    console.error('Error fetching election statistics:', err);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

/**
 * Get activity logs for election
 */
const getElectionActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { filter = 'all' } = req.query;

    // Get vote activities
    const votesResult = await db.query(
      `SELECT 
        v.id,
        v.voter_id,
        v.voted_at as timestamp,
        u.email,
        'vote' as type,
        'Vote cast successfully' as action,
        CONCAT('Vote for election #', v.election_id) as details,
        NULL as severity,
        NULL as ip_address
       FROM votes v
       JOIN users u ON v.voter_id = u.voter_id
       WHERE v.election_id = $1
       ORDER BY v.voted_at DESC
       LIMIT 50`,
      [id]
    );

    let activities = votesResult.rows.map(row => ({
      ...row,
      timestamp: row.timestamp
    }));

    // Check for suspicious activities
    // 1. Multiple vote attempts (would be blocked but logged)
    const multipleAttemptsResult = await db.query(
      `SELECT voter_id, COUNT(*) as attempts
       FROM votes
       WHERE election_id = $1
       GROUP BY voter_id
       HAVING COUNT(*) > 1`,
      [id]
    );

    const suspiciousActivities = multipleAttemptsResult.rows.map(row => ({
      voter_id: row.voter_id,
      type: 'suspicious',
      action: 'Multiple vote attempts detected',
      description: `Voter ${row.voter_id} attempted to vote ${row.attempts} times`,
      details: 'Possible fraud attempt - double voting',
      severity: 'critical',
      timestamp: new Date(),
      ip_address: 'Multiple IPs'
    }));

    // Filter activities based on filter type
    if (filter === 'suspicious') {
      activities = suspiciousActivities;
    } else if (filter === 'normal') {
      // Only normal vote activities
    } else {
      // All activities - merge
      activities = [...activities, ...suspiciousActivities].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    }

    res.json({
      activities,
      suspicious: suspiciousActivities
    });
  } catch (err) {
    console.error('Error fetching activity logs:', err);
    res.status(500).json({ message: 'Failed to fetch activity logs' });
  }
};

/**
 * Get blockchain transaction data
 */
const getBlockchainData = async (req, res) => {
  try {
    const { id } = req.params;

    // Get vote receipts with blockchain transactions
    const receiptsResult = await db.query(
      `SELECT 
        vr.receipt_hash,
        vr.blockchain_tx as tx_hash,
        vr.generated_at as timestamp,
        v.voted_at
       FROM vote_receipts vr
       JOIN votes v ON vr.vote_id = v.id
       WHERE v.election_id = $1
       ORDER BY vr.generated_at DESC
       LIMIT 50`,
      [id]
    );

    const transactions = receiptsResult.rows.map(row => ({
      receipt_hash: row.receipt_hash,
      tx_hash: row.tx_hash,
      timestamp: row.voted_at || row.timestamp,
      status: row.tx_hash ? 'confirmed' : 'pending',
      block_number: null, // Would be fetched from blockchain
      gas_used: null // Would be fetched from blockchain
    }));

    // Calculate stats
    const stats = {
      totalTransactions: transactions.length,
      confirmed: transactions.filter(t => t.status === 'confirmed').length,
      pending: transactions.filter(t => t.status === 'pending').length,
      totalGas: '0', // Would be calculated from blockchain data
      contractAddress: process.env.VOTING_CONTRACT_ADDRESS || '0x...',
      avgGasPrice: '0',
      latestBlock: null
    };

    res.json({
      transactions,
      stats
    });
  } catch (err) {
    console.error('Error fetching blockchain data:', err);
    res.status(500).json({ message: 'Failed to fetch blockchain data' });
  }
};

/**
 * Get biometric failure logs
 */
const getBiometricLogs = async (req, res) => {
  try {
    const { id } = req.params;

    // Note: This would require a biometric_logs table in production
    // For now, returning mock data structure
    const logs = [];

    res.json({
      logs,
      summary: {
        totalAttempts: 0,
        failures: 0,
        successRate: 100
      }
    });
  } catch (err) {
    console.error('Error fetching biometric logs:', err);
    res.status(500).json({ message: 'Failed to fetch biometric logs' });
  }
};

/**
 * Get real-time dashboard overview
 */
const getDashboardOverview = async (req, res) => {
  try {
    // Get total elections
    const electionsResult = await db.query(
      'SELECT COUNT(*) as count FROM elections'
    );
    const totalElections = parseInt(electionsResult.rows[0].count);

    // Get active elections
    const activeElectionsResult = await db.query(
      'SELECT COUNT(*) as count FROM elections WHERE start_date <= NOW() AND end_date >= NOW()'
    );
    const activeElections = parseInt(activeElectionsResult.rows[0].count);

    // Get total votes cast today
    const todayVotesResult = await db.query(
      "SELECT COUNT(*) as count FROM votes WHERE DATE(voted_at) = CURRENT_DATE"
    );
    const todayVotes = parseInt(todayVotesResult.rows[0].count);

    // Get total voters
    const votersResult = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'voter'"
    );
    const totalVoters = parseInt(votersResult.rows[0].count);

    // Get recent activity (last 10 votes)
    const recentActivityResult = await db.query(
      `SELECT 
        v.voted_at,
        u.voter_id,
        e.title as election_title
       FROM votes v
       JOIN users u ON v.voter_id = u.voter_id
       JOIN elections e ON v.election_id = e.id
       ORDER BY v.voted_at DESC
       LIMIT 10`
    );

    res.json({
      totalElections,
      activeElections,
      todayVotes,
      totalVoters,
      recentActivity: recentActivityResult.rows
    });
  } catch (err) {
    console.error('Error fetching dashboard overview:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard overview' });
  }
};

module.exports = {
  getElectionStatistics,
  getElectionActivity,
  getBlockchainData,
  getBiometricLogs,
  getDashboardOverview
};
