const candidateModel = require('../models/candidate');

const addCandidate = async (req, res) => {
  try {
    const { name, party, manifesto, election_id } = req.body;
    
    if (!name || !party || !election_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Get image URL from Cloudinary response
    // req.file.path contains the Cloudinary URL when using CloudinaryStorage
    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path; // Cloudinary provides full URL in 'path' property
    }
    
    const [candidate] = await candidateModel.createCandidate({ 
      name, 
      party, 
      manifesto, 
      image: imageUrl, // Store the full Cloudinary URL
      election_id 
    });
    
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add candidate', error: err.message });
  }
};

const getCandidatesByElection = async (req, res) => {
  try {
    const { election_id } = req.params;
    const candidates = await candidateModel.getCandidatesByElection(election_id);
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch candidates', error: err.message });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    await candidateModel.deleteCandidate(id);
    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete candidate', error: err.message });
  }
};

const getAllCandidates = async (req, res) => {
  try {
    const db = require('../models/db');
    const candidates = await db('candidates')
      .select('*')
      .orderBy('created_at', 'desc');
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all candidates', error: err.message });
  }
};

module.exports = { addCandidate, getCandidatesByElection, deleteCandidate, getAllCandidates };
