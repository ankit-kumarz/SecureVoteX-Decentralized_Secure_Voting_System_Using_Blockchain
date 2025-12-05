import { ethers } from 'ethers';
import VotingABI from '../abi/Voting.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_VOTING_CONTRACT || VotingABI.contractAddress;
const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY;
const NETWORK = process.env.REACT_APP_ETHEREUM_NETWORK || 'sepolia';

// Initialize provider
const getProvider = () => {
  if (window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  // Fallback to Infura for read-only operations
  return new ethers.JsonRpcProvider(`https://${NETWORK}.infura.io/v3/${INFURA_API_KEY}`);
};

// Connect MetaMask wallet
export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed. Please install MetaMask browser extension.');
  }
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Check if on correct network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const expectedChainId = NETWORK === 'sepolia' ? '0xaa36a7' : '0x13881'; // Sepolia: 11155111, Mumbai: 80001
    
    if (chainId !== expectedChainId) {
      throw new Error(`Please switch to ${NETWORK} network in MetaMask`);
    }
    
    return accounts[0];
  } catch (error) {
    console.error('Wallet connection error:', error);
    throw error;
  }
};

// Get contract instance with signer (for write operations)
export const getVotingContract = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not found');
  }
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    VotingABI.abi,
    signer
  );
};

// Get contract instance with provider (for read operations)
export const getVotingContractReadOnly = () => {
  const provider = getProvider();
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    VotingABI.abi,
    provider
  );
};

// Cast vote on blockchain
export const voteOnBlockchain = async (electionId, candidateId) => {
  try {
    const contract = await getVotingContract();
    
    // Estimate gas before sending transaction
    const gasEstimate = await contract.vote.estimateGas(electionId, candidateId);
    
    // Send transaction with 20% extra gas
    const tx = await contract.vote(electionId, candidateId, {
      gasLimit: gasEstimate * 120n / 100n
    });
    
    console.log('Transaction sent:', tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log('Transaction confirmed in block:', receipt.blockNumber);
    
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    console.error('Blockchain vote error:', error);
    throw new Error(error.reason || error.message || 'Failed to cast vote on blockchain');
  }
};

// Get election results from blockchain
export const getResultsFromBlockchain = async (electionId) => {
  try {
    const contract = getVotingContractReadOnly();
    const results = await contract.getResults(electionId);
    
    // Convert BigInt to numbers
    return results.map(count => Number(count));
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
};

// Check if user has voted
export const hasVotedOnBlockchain = async (electionId, voterAddress) => {
  try {
    const contract = getVotingContractReadOnly();
    return await contract.hasVoted(electionId, voterAddress);
  } catch (error) {
    console.error('Error checking vote status:', error);
    return false;
  }
};

// Create election on blockchain
export const createElectionOnBlockchain = async (title, description, startDate, endDate) => {
  try {
    const contract = await getVotingContract();
    const tx = await contract.createElection(
      title,
      description,
      Math.floor(new Date(startDate).getTime() / 1000),
      Math.floor(new Date(endDate).getTime() / 1000)
    );
    
    const receipt = await tx.wait();
    
    // Parse event to get election ID
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed.name === 'ElectionCreated';
      } catch {
        return false;
      }
    });
    
    const electionId = event ? Number(contract.interface.parseLog(event).args.electionId) : null;
    
    return {
      txHash: tx.hash,
      electionId
    };
  } catch (error) {
    console.error('Error creating election:', error);
    throw error;
  }
};

// Add candidate to blockchain
export const addCandidateOnBlockchain = async (electionId, name, party, manifesto, imageUrl) => {
  try {
    const contract = await getVotingContract();
    const tx = await contract.addCandidate(electionId, name, party, manifesto, imageUrl);
    const receipt = await tx.wait();
    
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error adding candidate:', error);
    throw error;
  }
};

// Get current wallet address
export const getCurrentAccount = async () => {
  if (!window.ethereum) return null;
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts[0] || null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

// Listen for account changes
export const onAccountChange = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      callback(accounts[0] || null);
    });
  }
};

// Listen for network changes
export const onNetworkChange = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', (chainId) => {
      callback(chainId);
      // Reload page on network change (recommended by MetaMask)
      window.location.reload();
    });
  }
};

export default {
  connectWallet,
  getVotingContract,
  voteOnBlockchain,
  getResultsFromBlockchain,
  hasVotedOnBlockchain,
  createElectionOnBlockchain,
  addCandidateOnBlockchain,
  getCurrentAccount,
  onAccountChange,
  onNetworkChange
};
