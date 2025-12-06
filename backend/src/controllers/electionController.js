const electionModel = require('../models/election');
const electionKeyModel = require('../models/electionKey');
const { generateElectionKeyPair } = require('../utils/keyManagement');

const createElection = async (req, res) => {
  try {
    const { title, description, start_date, end_date } = req.body;
    if (!title || !start_date || !end_date) return res.status(400).json({ message: 'Missing fields' });
    
    // Create election
    const [election] = await electionModel.createElection({ title, description, start_date, end_date });
    
    // Automatically generate encryption keys for the election (non-blocking)
    setImmediate(async () => {
      try {
        const { publicKey, privateKey, fingerprint } = generateElectionKeyPair();
        await electionKeyModel.createElectionKey({
          election_id: election.id,
          public_key: publicKey,
          private_key: privateKey,
          public_key_fingerprint: fingerprint,
          key_created_at: new Date()
        });
        console.log('✅ Encryption keys generated for election', election.id);
      } catch (keyErr) {
        console.error('⚠️ Failed to generate encryption keys:', keyErr.message);
      }
    });
    
    res.status(201).json({
      ...election,
      message: 'Election created successfully'
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create election', error: err.message });
  }
};

const getAllElections = async (req, res) => {
  try {
    const elections = await electionModel.getAllElections();
    res.json(elections);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch elections', error: err.message });
  }
};

const deleteElection = async (req, res) => {
  try {
    const { id } = req.params;
    await electionModel.deleteElection(id);
    res.json({ message: 'Election deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete election', error: err.message });
  }
};

/**
 * Debug endpoint - Shows all elections and which ones are active
 * GET /api/election/debug-elections
 */
const debugElections = async (req, res) => {
  try {
    const now = new Date();
    const elections = await electionModel.getAllElections();
    
    const electionsWithDebug = elections.map(e => {
      const start = new Date(e.start_date);
      const end = new Date(e.end_date);
      const isActive = start <= now && now <= end;
      
      return {
        ...e,
        start_date: e.start_date,
        end_date: e.end_date,
        now: now.toISOString(),
        start_date_ms: start.getTime(),
        end_date_ms: end.getTime(),
        now_ms: now.getTime(),
        isActive,
        reason: isActive ? 'ACTIVE' : (start > now ? 'NOT_STARTED' : 'ENDED')
      };
    });
    
    res.json({
      success: true,
      total: elections.length,
      active: electionsWithDebug.filter(e => e.isActive).length,
      elections: electionsWithDebug
    });
  } catch (err) {
    console.error('Debug error:', err);
    res.status(500).json({ message: 'Debug error', error: err.message });
  }
};

/**
 * Get count of active and upcoming elections
 * GET /api/election/active-count
 */
const getActiveElectionsCount = async (req, res) => {
  try {
    const now = new Date();
    const elections = await electionModel.getAllElections();
    
    const activeCount = elections.filter(e => {
      const start = new Date(e.start_date);
      const end = new Date(e.end_date);
      return start <= now && now <= end;
    }).length;
    
    const upcomingCount = elections.filter(e => {
      const start = new Date(e.start_date);
      return start > now;
    }).length;
    
    res.json({
      success: true,
      activeCount,
      upcomingCount,
      totalCount: elections.length
    });
  } catch (err) {
    console.error('Failed to fetch active elections count:', err);
    res.status(500).json({ message: 'Failed to fetch election counts', error: err.message });
  }
};

/**
 * Get all active elections with full details
 * GET /api/election/active-elections
 */
const getActiveElections = async (req, res) => {
  try {
    const now = new Date();
    const elections = await electionModel.getAllElections();
    
    const activeElections = elections.filter(e => {
      const start = new Date(e.start_date);
      const end = new Date(e.end_date);
      return start <= now && now <= end;
    });
    
    res.json({
      success: true,
      elections: activeElections,
      count: activeElections.length
    });
  } catch (err) {
    console.error('Failed to fetch active elections:', err);
    res.status(500).json({ message: 'Failed to fetch active elections', error: err.message });
  }
};

module.exports = { createElection, getAllElections, deleteElection, getActiveElectionsCount, getActiveElections, debugElections };
