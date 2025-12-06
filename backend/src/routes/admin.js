const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { authenticate, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

/**
 * Get admin dashboard statistics
 * GET /api/admin/stats
 */
const getAdminStats = async (req, res) => {
  try {
    // Total elections - handle empty result
    const electionResult = await db('elections').count('* as count').first();
    const totalElections = electionResult?.count || 0;
    
    // Active elections today
    const now = new Date();
    const activeResult = await db('elections')
      .where('start_date', '<=', now)
      .where('end_date', '>=', now)
      .count('* as count')
      .first();
    const activeCount = activeResult?.count || 0;
    
    // Total registered voters
    const voterResult = await db('users')
      .where('role', 'voter')
      .count('* as count')
      .first();
    const totalVoters = voterResult?.count || 0;
    
    // Total votes cast
    const votesResult = await db('votes').count('* as count').first();
    const totalVotes = votesResult?.count || 0;
    
    // Votes pending blockchain sync
    const pendingResult = await db('votes')
      .whereNull('blockchain_tx')
      .count('* as count')
      .first();
    const pendingSync = pendingResult?.count || 0;
    
    // Face-verified voters
    const verifiedResult = await db('voter_profiles')
      .whereNotNull('biometric_data')
      .count('* as count')
      .first();
    const verifiedVoters = verifiedResult?.count || 0;
    
    // System alerts count
    const alertsCount = 0;
    
    res.json({
      success: true,
      stats: {
        totalElections,
        activeElections: activeCount,
        totalRegisteredVoters: totalVoters,
        totalVotesCast: totalVotes,
        pendingBlockchainSync: pendingSync,
        faceVerifiedVoters: verifiedVoters,
        systemAlerts: alertsCount
      }
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
};

/**
 * Get real-time election monitoring data
 * GET /api/admin/election-monitor/:electionId
 */
const getElectionMonitor = async (req, res) => {
  try {
    const { electionId } = req.params;
    
    // Get election details
    const election = await db('elections').where('id', electionId).first();
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    // Total votes for this election - handle null result
    const totalVotesResult = await db('votes')
      .where('election_id', electionId)
      .count('* as count')
      .first();
    const totalVotes = totalVotesResult?.count || 0;
    
    // Get total eligible voters (all voters)
    const totalEligibleVotersResult = await db('users')
      .where('role', 'voter')
      .count('* as count')
      .first();
    const totalEligibleVoters = totalEligibleVotersResult?.count || 0;
    
    // Turnout percentage
    const turnout = totalEligibleVoters > 0 
      ? ((totalVotes / totalEligibleVoters) * 100).toFixed(2)
      : 0;
    
    // Vote distribution by candidate
    const voteDistribution = await db('votes')
      .select('candidates.name', 'candidates.id')
      .count('votes.id as votes')
      .join('candidates', 'votes.candidate_id', 'candidates.id')
      .where('votes.election_id', electionId)
      .groupBy('votes.candidate_id', 'candidates.name', 'candidates.id');
    
    // Recent activity timeline (last 50 votes)
    const recentActivity = await db('votes')
      .select(
        'votes.created_at',
        'votes.voter_id',
        'candidates.name as candidate_name',
        'votes.blockchain_tx'
      )
      .leftJoin('candidates', 'votes.candidate_id', 'candidates.id')
      .where('votes.election_id', electionId)
      .orderBy('votes.created_at', 'desc')
      .limit(50);
    
    // Hourly vote count (last 24 hours)
    const hourlyVotes = await db.raw(`
      SELECT 
        DATE_TRUNC('hour', created_at) as hour,
        COUNT(*) as count
      FROM votes
      WHERE election_id = ? AND created_at >= NOW() - INTERVAL '24 hours'
      GROUP BY hour
      ORDER BY hour ASC
    `, [electionId]);
    
    res.json({
      success: true,
      election,
      monitoring: {
        totalVotes: totalVotes,
        totalEligibleVoters: totalEligibleVoters,
        turnoutPercentage: parseFloat(turnout),
        voteDistribution,
        recentActivity,
        hourlyVotes: hourlyVotes.rows || []
      }
    });
  } catch (error) {
    console.error('Failed to fetch election monitor data:', error);
    res.status(500).json({ message: 'Failed to fetch monitoring data', error: error.message });
  }
};

/**
 * Get fraud detection alerts
 * GET /api/admin/fraud-alerts
 */
const getFraudAlerts = async (req, res) => {
  try {
    // Failed face verifications (check voter_profiles for null biometric data)
    const failedVerifications = await db.raw(`
      SELECT 
        user_id,
        COUNT(*) as attempt_count,
        MAX(created_at) as last_attempt
      FROM voter_profiles
      WHERE biometric_data IS NULL
      GROUP BY user_id
      HAVING COUNT(*) > 2
      ORDER BY attempt_count DESC
      LIMIT 50
    `);
    
    // Multiple votes from same voter (shouldn't happen, but check)
    const duplicateVotes = await db.raw(`
      SELECT 
        voter_id,
        election_id,
        COUNT(*) as vote_count
      FROM votes
      GROUP BY voter_id, election_id
      HAVING COUNT(*) > 1
    `);
    
    // Suspicious voting patterns (many votes in short time)
    const bulkVoting = await db.raw(`
      SELECT 
        voter_id,
        election_id,
        COUNT(*) as votes_in_hour,
        MIN(created_at) as start_time,
        MAX(created_at) as end_time
      FROM votes
      WHERE created_at >= NOW() - INTERVAL '1 hour'
      GROUP BY voter_id, election_id
      HAVING COUNT(*) > 5
    `);
    
    const failedVerificationsRows = failedVerifications.rows || [];
    const duplicateVotesRows = duplicateVotes.rows || [];
    const bulkVotingRows = bulkVoting.rows || [];
    
    const alerts = {
      failedVerifications: failedVerificationsRows.map(record => ({
        type: 'failed_face_verification',
        severity: record.attempt_count > 5 ? 'high' : 'medium',
        userId: record.user_id,
        attemptCount: record.attempt_count,
        lastAttempt: record.last_attempt,
        message: `User ${record.user_id} failed face verification ${record.attempt_count} times`
      })),
      duplicateVotes: duplicateVotesRows.map(record => ({
        type: 'duplicate_vote',
        severity: 'high',
        voterId: record.voter_id,
        electionId: record.election_id,
        voteCount: record.vote_count,
        message: `Voter ${record.voter_id} has ${record.vote_count} votes in election ${record.election_id}`
      })),
      bulkVoting: bulkVotingRows.map(record => ({
        type: 'bulk_voting_pattern',
        severity: 'medium',
        voterId: record.voter_id,
        electionId: record.election_id,
        votesInHour: record.votes_in_hour,
        timeRange: `${record.start_time} to ${record.end_time}`,
        message: `Suspicious voting pattern: ${record.votes_in_hour} votes in 1 hour`
      }))
    };
    
    res.json({
      success: true,
      alerts,
      totalAlerts: 
        alerts.failedVerifications.length + 
        alerts.duplicateVotes.length + 
        alerts.bulkVoting.length
    });
  } catch (error) {
    console.error('Failed to fetch fraud alerts:', error);
    res.status(500).json({ message: 'Failed to fetch fraud alerts', error: error.message });
  }
};

/**
 * Get admin audit trail
 * GET /api/admin/audit-trail
 */
const getAuditTrail = async (req, res) => {
  try {
    // For now, we'll create audit logs from existing data
    // In production, you should have a dedicated audit_logs table
    
    const recentElections = await db('elections')
      .select('id', 'title', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(20);
    
    const recentCandidates = await db('candidates')
      .select('id', 'name', 'election_id', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(20);
    
    const auditLogs = [
      ...recentElections.map(e => ({
        action: 'created_election',
        resourceType: 'election',
        resourceId: e.id,
        resourceName: e.title,
        timestamp: e.created_at,
        adminName: 'Admin User'
      })),
      ...recentCandidates.map(c => ({
        action: 'added_candidate',
        resourceType: 'candidate',
        resourceId: c.id,
        resourceName: c.name,
        electionId: c.election_id,
        timestamp: c.created_at,
        adminName: 'Admin User'
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({
      success: true,
      auditLogs: auditLogs.slice(0, 50)
    });
  } catch (error) {
    console.error('Failed to fetch audit trail:', error);
    res.status(500).json({ message: 'Failed to fetch audit trail', error: error.message });
  }
};

/**
 * Get system health status
 * GET /api/admin/system-health
 */
const getSystemHealth = async (req, res) => {
  try {
    // Database health check
    let dbHealth = 'healthy';
    try {
      await db.raw('SELECT 1');
    } catch (err) {
      dbHealth = 'critical';
    }
    
    // Get database stats
    const dbStats = await db.raw('SHOW TABLE STATUS');
    
    // API server health (always healthy if this runs)
    const apiHealth = 'healthy';
    
    // Blockchain node status (placeholder - would need actual RPC call)
    const blockchainHealth = 'healthy';
    
    // Face recognition module (check if profiles exist)
    let faceRecognitionHealth = 'healthy';
    const profilesCount = await db('voter_profiles').count('* as count').first();
    if (profilesCount.count === 0) {
      faceRecognitionHealth = 'warning';
    }
    
    res.json({
      success: true,
      health: {
        overall: dbHealth === 'healthy' && apiHealth === 'healthy' ? 'healthy' : 'warning',
        components: {
          database: {
            status: dbHealth,
            tablesCount: dbStats[0]?.length || 0
          },
          apiServer: {
            status: apiHealth,
            uptime: process.uptime()
          },
          blockchainNode: {
            status: blockchainHealth,
            network: 'Sepolia Testnet',
            contractAddress: process.env.CONTRACT_ADDRESS || 'Not configured'
          },
          faceRecognition: {
            status: faceRecognitionHealth,
            registeredProfiles: profilesCount.count || 0
          }
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch system health:', error);
    res.status(500).json({ message: 'Failed to fetch system health', error: error.message });
  }
};

/**
 * Get all users (admin only)
 * GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await db('users')
      .select('id', 'email', 'role', 'voter_id', 'wallet_address', 'created_at')
      .orderBy('created_at', 'desc');
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// Routes
router.get('/stats', authenticate, authorize(['admin']), getAdminStats);
router.get('/users', authenticate, authorize(['admin']), getAllUsers);
router.get('/election-monitor/:electionId', authenticate, authorize(['admin']), getElectionMonitor);
router.get('/fraud-alerts', authenticate, authorize(['admin']), getFraudAlerts);
router.get('/audit-trail', authenticate, authorize(['admin']), getAuditTrail);
router.get('/system-health', authenticate, authorize(['admin']), getSystemHealth);

// Admin Management Routes (SUPER_ADMIN only)
router.post('/create-admin', authenticate, authorize(['SUPER_ADMIN']), adminController.createAdmin);
router.get('/list-admins', authenticate, authorize(['SUPER_ADMIN']), adminController.listAdmins);
router.post('/reset-password/:admin_id', authenticate, authorize(['SUPER_ADMIN']), adminController.resetAdminPassword);
router.post('/disable/:admin_id', authenticate, authorize(['SUPER_ADMIN']), adminController.disableAdmin);
router.delete('/delete/:admin_id', authenticate, authorize(['SUPER_ADMIN']), adminController.deleteAdmin);

// All admins can change their own password
router.post('/change-password', authenticate, adminController.changePassword);

module.exports = router;
