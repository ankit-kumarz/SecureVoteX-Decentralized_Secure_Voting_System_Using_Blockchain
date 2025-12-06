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

module.exports = { createElection, getAllElections, deleteElection, getActiveElectionsCount, getActiveElections };
