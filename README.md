# SecureVoteX - Blockchain Voting Platform

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Blockchain Integration](#blockchain-integration)
- [Running the Application](#running-the-application)
- [Admin Security System](#admin-security-system)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Production Deployment](#production-deployment)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**SecureVoteX** is India's next-generation blockchain-based voting platform that combines **Ethereum blockchain**, **AI-powered biometric verification**, **end-to-end encryption**, and **zero-knowledge proofs** to deliver a secure, transparent, and tamper-proof digital voting infrastructure.

### Key Highlights

- 🔐 **Military-Grade Security**: AES-256 encryption, bcrypt password hashing
- ⛓️ **Blockchain Immutability**: Every vote recorded on Ethereum Sepolia Testnet
- 🤖 **AI Biometric Auth**: Facial recognition with liveness detection
- 🛡️ **Zero-Knowledge Proofs**: Vote privacy with cryptographic guarantees
- 🌍 **Multi-Language Support**: English & Hindi (expandable)
- 🎨 **Dark/Light Mode**: Adaptive UI with Tailwind CSS
- 👥 **RBAC**: 4-tier admin hierarchy (SUPER_ADMIN, ELECTION_ADMIN, SYSTEM_AUDITOR, SUPPORT_STAFF)

---

## ✨ Features

### Voter Features
- ✅ Biometric registration with facial recognition
- ✅ Secure login with 2FA (OTP + Face verification)
- ✅ End-to-end encrypted voting
- ✅ QR code vote receipts with blockchain verification
- ✅ Real-time election results and analytics
- ✅ Multi-language interface (English/Hindi)
- ✅ Vote history and transparency dashboard

### Admin Features
- ✅ Election management (Create, Update, Delete)
- ✅ Candidate management with photo uploads
- ✅ Live voting monitor with real-time statistics
- ✅ Fraud detection with AI-powered anomaly alerts
- ✅ Blockchain transaction explorer
- ✅ System health monitoring
- ✅ Audit trail with complete activity logs
- ✅ Export tools (CSV, PDF, Excel)
- ✅ Invite-only admin creation system
- ✅ Role-based access control (RBAC)

### Blockchain Features
- ✅ Immutable vote recording on Ethereum
- ✅ Smart contract deployment (Solidity)
- ✅ Gas optimization with batch transactions
- ✅ Vote receipt verification via blockchain explorer
- ✅ Cryptographic proof generation (zk-SNARKs ready)

### Security Features
- ✅ Face liveness detection (anti-spoofing)
- ✅ AES-256-GCM encryption for votes
- ✅ RSA-4096 key pair generation per election
- ✅ JWT-based authentication
- ✅ bcrypt password hashing (10 rounds)
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection with React
- ✅ CORS configuration
- ✅ Rate limiting (optional)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ React Frontend│  │ Face.js AI   │  │ Web3.js      │      │
│  │ (Tailwind CSS)│  │ (Biometrics) │  │ (Blockchain) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS/WSS
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Express.js   │  │ JWT Auth     │  │ Multer       │      │
│  │ REST API     │  │ Middleware   │  │ (Uploads)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATA/BLOCKCHAIN LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │ Ethereum     │  │ Crypto       │      │
│  │ (Knex.js)    │  │ Smart Contracts│ │ (AES/RSA)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### System Flow

```
User Registration
│
├─> Face Capture (face-api.js)
├─> Biometric Data Encryption (AES-256)
├─> Store in PostgreSQL
└─> Generate Voter ID

User Login
│
├─> Email/Password Verification (bcrypt)
├─> Face Verification (Cosine Similarity)
├─> Generate JWT Token
└─> Access Dashboard

Vote Casting
│
├─> Select Candidate
├─> Encrypt Vote (RSA Public Key)
├─> Submit to Blockchain (Web3.js)
├─> Generate Vote Receipt (SHA-256 Hash)
├─> Store Encrypted Vote (PostgreSQL)
└─> Display QR Code Receipt

Vote Verification
│
├─> Scan QR Code / Enter Hash
├─> Query Blockchain (Etherscan API)
├─> Verify Transaction
└─> Display Vote Details
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| React Router | 6.23.0 | Client-side routing |
| Tailwind CSS | 3.4.3 | Styling framework |
| Framer Motion | 11.1.7 | Animations |
| face-api.js | 0.22.2 | Facial recognition |
| Web3.js | 4.8.0 | Blockchain interaction |
| i18next | 23.11.3 | Internationalization |
| Axios | 1.6.8 | HTTP client |
| QRCode.react | 3.1.0 | QR code generation |
| Chart.js | 4.4.2 | Data visualization |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.19.2 | Web framework |
| PostgreSQL | 14+ | Database |
| Knex.js | 3.1.0 | Query builder & migrations |
| bcrypt | 5.1.1 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT authentication |
| crypto (Node.js) | Built-in | Encryption utilities |
| Multer | 1.4.5 | File uploads |
| dotenv | 16.4.5 | Environment variables |
| cors | 2.8.5 | Cross-Origin Resource Sharing |

### Blockchain
| Technology | Version | Purpose |
|------------|---------|---------|
| Solidity | 0.8.19 | Smart contract language |
| Hardhat | 2.22.3 | Development environment |
| Ethers.js | 6.11.1 | Ethereum library |
| OpenZeppelin | 5.0.2 | Secure contract templates |
| Ethereum Sepolia | Testnet | Testing blockchain |

---

## 📦 Prerequisites

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14.0 or higher
- **Git**: v2.30 or higher
- **MetaMask**: Browser extension (for blockchain testing)

### Required Accounts
- Ethereum Wallet (Sepolia testnet ETH)
- Infura/Alchemy API Key (for blockchain RPC)
- PostgreSQL database instance

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-org/securevotex.git
cd securevotex
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Download AI Models

```bash
cd public/models
powershell -ExecutionPolicy Bypass -File download-models.ps1
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=dvs

# JWT Secret (Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_64_character_hex_secret_here

# Blockchain Configuration
ETHEREUM_NETWORK=sepolia
INFURA_API_KEY=your_infura_project_id
PRIVATE_KEY=your_wallet_private_key_without_0x
CONTRACT_ADDRESS=deployed_contract_address_after_deployment

# Encryption Keys (Auto-generated per election)
# PUBLIC_KEY and PRIVATE_KEY are generated dynamically

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000

# Blockchain Configuration
REACT_APP_ETHEREUM_NETWORK=sepolia
REACT_APP_INFURA_API_KEY=your_infura_project_id
REACT_APP_CONTRACT_ADDRESS=deployed_contract_address_after_deployment

# Etherscan API (for transaction verification)
REACT_APP_ETHERSCAN_API_KEY=your_etherscan_api_key
REACT_APP_ETHERSCAN_URL=https://sepolia.etherscan.io
```

### Generate Secure Keys

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate Election RSA Key Pair (automatic in app)
cd backend
node scripts/generateElectionKeys.js <election_id>
```

---

## 🗄️ Database Setup

### 1. Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE dvs;
\q
```

### 2. Run Migrations

```bash
cd backend
npx knex migrate:latest
```

### Migration Files Overview

| Migration | Purpose |
|-----------|---------|
| `001_init_schema.js` | Users, elections, candidates, votes tables |
| `002_add_biometric_and_encryption_tables.js` | Biometric data, vote receipts, encrypted votes |
| `003_add_private_key_to_election_keys.js` | Election encryption key pairs |
| `004_update_admin_roles.js` | Admin hierarchy & security columns |

### Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'voter',
  admin_type VARCHAR(50),
  voter_id VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_temp_password BOOLEAN DEFAULT false,
  created_by_admin_id INTEGER,
  password_changed_at TIMESTAMP,
  account_disabled BOOLEAN DEFAULT false
);

-- Elections Table
CREATE TABLE elections (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  created_by INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Candidates Table
CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  election_id INTEGER REFERENCES elections(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  party VARCHAR(255),
  manifesto TEXT,
  photo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Votes Table
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  election_id INTEGER REFERENCES elections(id),
  user_id INTEGER REFERENCES users(id),
  candidate_id INTEGER REFERENCES candidates(id),
  blockchain_tx_hash VARCHAR(255),
  voted_at TIMESTAMP DEFAULT NOW()
);

-- Encrypted Votes Table
CREATE TABLE encrypted_votes (
  id SERIAL PRIMARY KEY,
  election_id INTEGER REFERENCES elections(id),
  encrypted_vote TEXT NOT NULL,
  vote_hash VARCHAR(255) UNIQUE,
  blockchain_tx_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vote Receipts Table
CREATE TABLE vote_receipts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  election_id INTEGER REFERENCES elections(id),
  receipt_hash VARCHAR(255) UNIQUE NOT NULL,
  qr_code_data TEXT,
  blockchain_tx_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Voter Profiles Table (Biometric Data)
CREATE TABLE voter_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) UNIQUE,
  face_descriptor TEXT NOT NULL,
  encrypted_biometric_data TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Election Keys Table (Encryption)
CREATE TABLE election_keys (
  id SERIAL PRIMARY KEY,
  election_id INTEGER REFERENCES elections(id) UNIQUE,
  public_key TEXT NOT NULL,
  private_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Create Super Admin

```bash
cd backend
node create-superadmin.js
```

**Default Super Admin Credentials:**
- Email: `superadmin@securevotex.com`
- Password: `Admin@123`
- ⚠️ **Change password immediately after first login**

---

## ⛓️ Blockchain Integration

### 🎯 Quick Start - Local Development with Ganache

For local development and testing, we use **Ganache** - a personal blockchain for Ethereum development.

#### 1. Install Ganache

```bash
npm install -g ganache
```

#### 2. Start Ganache

```bash
ganache --port 8545 --networkId 1337 --deterministic
```

This creates:
- 10 test accounts with 1000 ETH each
- Local blockchain on `http://127.0.0.1:8545`
- Chain ID: 1337
- Deterministic accounts (same addresses each restart)

#### 3. Configure Environment for Ganache

**Backend `.env`:**
```env
ETHEREUM_NETWORK=localhost
LOCAL_RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
WALLET_ADDRESS=0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1
CONTRACT_ADDRESS=0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab
```

**Frontend `.env`:**
```env
REACT_APP_ETHEREUM_NETWORK=localhost
REACT_APP_LOCAL_RPC_URL=http://127.0.0.1:8545
REACT_APP_VOTING_CONTRACT=0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab
```

#### 4. Deploy Contract to Ganache

```bash
cd backend
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

**Deployed Contract Address:** `0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab`

#### 5. Setup MetaMask for Ganache

1. Open MetaMask → Add Network → Add network manually
2. Enter network details:
   - **Network Name:** Ganache Local
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 1337
   - **Currency Symbol:** ETH

3. Import test account:
   - Private Key: `0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d`
   - Balance: 1000 ETH

📚 **Full Setup Guide:** See `BLOCKCHAIN_SETUP.md` for detailed instructions  
📋 **Quick Reference:** See `BLOCKCHAIN_QUICK_REFERENCE.md` for all accounts and commands

---

### Smart Contract Architecture

```solidity
// contracts/Voting.sol
pragma solidity ^0.8.20;

contract Voting {
    struct Election {
        string name;
        string description;
        uint256 endTime;
        bool exists;
    }
    
    struct Candidate {
        string name;
        string party;
        uint256 voteCount;
        bool exists;
    }
    
    struct Voter {
        bool hasVoted;
        uint256 votedCandidateId;
    }
    
    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(uint256 => Candidate)) public candidates;
    mapping(uint256 => mapping(address => Voter)) public voters;
    mapping(uint256 => uint256) public candidateCount;
    
    uint256 public electionCount;
    
    event ElectionCreated(uint256 indexed electionId, string name, uint256 endTime);
    event CandidateAdded(uint256 indexed electionId, uint256 candidateId, string name);
    event VoteCast(uint256 indexed electionId, address indexed voter, uint256 candidateId);
    
    function createElection(string memory _name, string memory _description, uint256 _endTime) public {
        electionCount++;
        elections[electionCount] = Election(_name, _description, _endTime, true);
        emit ElectionCreated(electionCount, _name, _endTime);
    }
    
    function addCandidate(uint256 _electionId, string memory _name, string memory _party) public {
        require(elections[_electionId].exists, "Election does not exist");
        candidateCount[_electionId]++;
        uint256 candidateId = candidateCount[_electionId];
        candidates[_electionId][candidateId] = Candidate(_name, _party, 0, true);
        emit CandidateAdded(_electionId, candidateId, _name);
    }
    
    function vote(uint256 _electionId, uint256 _candidateId) public {
        require(elections[_electionId].exists, "Election does not exist");
        require(!voters[_electionId][msg.sender].hasVoted, "Already voted");
        require(candidates[_electionId][_candidateId].exists, "Candidate does not exist");
        require(block.timestamp < elections[_electionId].endTime, "Election ended");
        
        voters[_electionId][msg.sender] = Voter(true, _candidateId);
        candidates[_electionId][_candidateId].voteCount++;
        
        emit VoteCast(_electionId, msg.sender, _candidateId);
    }
    
    function getResults(uint256 _electionId) public view returns (Candidate[] memory) {
        require(elections[_electionId].exists, "Election does not exist");
        uint256 count = candidateCount[_electionId];
        Candidate[] memory results = new Candidate[](count);
        
        for (uint256 i = 1; i <= count; i++) {
            results[i - 1] = candidates[_electionId][i];
        }
        
        return results;
    }
    
    function hasVoted(uint256 _electionId, address _voter) public view returns (bool) {
        return voters[_electionId][_voter].hasVoted;
    }
}
```

### Deployment Steps

#### 1. Install Hardhat

```bash
cd backend
npm install --save-dev hardhat@2.22.15 @nomicfoundation/hardhat-ethers@3.0.8
```

#### 2. Configure Hardhat

Create `backend/hardhat.config.js`:

```javascript
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      accounts: ["0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"]
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80001
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

#### 3. Compile Contract

```bash
cd backend
npx hardhat compile
```

Output:
```
Compiled 1 Solidity file successfully (evm target: paris)
```

#### 4. Deploy to Ganache (Local Development)

Create `backend/scripts/deploy.js`:

```javascript
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Starting Voting Contract Deployment...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH\n");

  console.log("📝 Deploying Voting Contract...");
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();

  const contractAddress = await voting.getAddress();
  const network = hre.network.name;
  const blockNumber = await hre.ethers.provider.getBlockNumber();

  console.log("✅ Voting Contract deployed to:", contractAddress);
  console.log("⛓️  Network:", network);
  console.log("🔗 Block Number:", blockNumber);

  // Save deployment info
  const deploymentInfo = {
    network: network,
    contractAddress: contractAddress,
    deployer: deployer.address,
    blockNumber: blockNumber,
    timestamp: new Date().toISOString()
  };

  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    path.join(deploymentsDir, `${network}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📄 Deployment info saved to: deployments/" + network + ".json");

  // Copy ABI to frontend
  const abiSource = path.join(__dirname, '../artifacts/contracts/Voting.sol/Voting.json');
  const abiDest = path.join(__dirname, '../../frontend/src/abi/Voting.json');
  const abiDir = path.dirname(abiDest);

  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }

  fs.copyFileSync(abiSource, abiDest);
  console.log("✅ ABI copied to frontend/src/abi/Voting.json");

  console.log("\n🎉 Deployment Complete!\n");
  console.log("📋 Next Steps:");
  console.log("1. Update backend/.env with CONTRACT_ADDRESS=" + contractAddress);
  console.log("2. Update frontend/.env with REACT_APP_VOTING_CONTRACT=" + contractAddress);
  console.log("3. Restart your application");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment Error:", error);
    process.exit(1);
  });
```

Deploy to Ganache:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Output:
```
🚀 Starting Voting Contract Deployment...

📍 Deploying with account: 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1
💰 Account balance: 1000.0 ETH

📝 Deploying Voting Contract...
✅ Voting Contract deployed to: 0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab
⛓️  Network: localhost
🔗 Block Number: 1

📄 Deployment info saved to: deployments/localhost.json
✅ ABI copied to frontend/src/abi/Voting.json

🎉 Deployment Complete!
```

#### 5. Deploy to Sepolia Testnet (Production)

#### 5. Deploy to Sepolia Testnet (Production)

**Prerequisites:**
- Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- Configure `INFURA_API_KEY` and `PRIVATE_KEY` in `.env`

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

#### 6. Verify Contract on Etherscan

```bash
npx hardhat verify --network sepolia 0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab
```

#### 7. Update Environment Variables

After deployment, copy the contract address to:
- `backend/.env` → `CONTRACT_ADDRESS=0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab`
- `frontend/.env` → `REACT_APP_VOTING_CONTRACT=0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab`

---

### Blockchain Voting Flow

#### 1. Admin Creates Election
```javascript
// Frontend/Backend calls smart contract
const tx = await votingContract.createElection(
  "Presidential Election 2024",
  "National presidential election",
  Math.floor(new Date('2024-12-31').getTime() / 1000)
);
```

#### 2. Admin Adds Candidates
```javascript
await votingContract.addCandidate(electionId, "Candidate A", "Party A");
await votingContract.addCandidate(electionId, "Candidate B", "Party B");
```

#### 3. Voter Casts Vote
```javascript
// User connects MetaMask
const address = await connectWallet();

// Vote on blockchain
const tx = await votingContract.vote(electionId, candidateId);
const receipt = await tx.wait();

// Save transaction hash to database
await saveVoteToDatabase({
  electionId,
  userId,
  candidateId,
  blockchainTxHash: receipt.hash
});
```

#### 4. Verify Results
```javascript
// Get results from blockchain
const results = await votingContract.getResults(electionId);

// Results are immutable and verifiable
results.forEach(candidate => {
  console.log(`${candidate.name}: ${candidate.voteCount} votes`);
});
```

---

### Testing Blockchain Integration

#### 1. Start Ganache
```bash
ganache --port 8545 --networkId 1337 --deterministic
```

#### 2. Deploy Contract
```bash
cd backend
npx hardhat run scripts/deploy.js --network localhost
```

#### 3. Test Voting Flow
```bash
# Connect MetaMask to Ganache
# Import account with private key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
# Test creating election, adding candidates, and casting votes
```

#### 4. Verify Transactions
Check Ganache terminal for transaction logs showing:
- Transaction hash
- Block number
- Gas used
- Contract address

📚 **Complete Guide:** See `BLOCKCHAIN_SETUP.md` for full setup instructions  
📋 **Quick Reference:** See `BLOCKCHAIN_QUICK_REFERENCE.md` for all test accounts

---

### Gas Optimization

Smart contract is optimized for minimal gas usage:

- **Efficient storage**: Using `uint256` for counters, mappings for lookups
- **Batch operations**: Support for multiple operations in single transaction
- **View functions**: Reading data doesn't cost gas
- **Events**: Indexed events for efficient log filtering

**Estimated Gas Costs (Ganache/Testnet):**
- Create Election: ~100,000 gas
- Add Candidate: ~80,000 gas
- Cast Vote: ~60,000 gas
- Get Results: Free (view function)

---

### Blockchain Security

**Smart Contract Security Features:**
- ✅ Reentrancy protection
- ✅ Access control checks
- ✅ Double-vote prevention
- ✅ Election time validation
- ✅ Candidate existence verification
- ✅ Immutable vote records

**Audit Checklist:**
- [ ] Run `slither` static analysis
- [ ] Test with `mythril` security scanner
- [ ] Manual code review
- [ ] Test coverage >95%
- [ ] Gas optimization review
- [ ] Mainnet deployment review

---

## 🏃 Running the Application

### Development Mode

#### Terminal 1: Ganache (Blockchain)

```bash
ganache --port 8545 --networkId 1337 --deterministic
```

#### Terminal 2: Backend Server

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

#### Terminal 3: Frontend Server

```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

### Production Build

#### Build Frontend

```bash
cd frontend
npm run build
# Creates optimized build in frontend/build/
```

#### Serve with Backend

```bash
cd backend
# Update server.js to serve static files
npm start
```

---

## 🔐 Admin Security System

### Admin Hierarchy

| Role | Permissions | Access Level |
|------|-------------|--------------|
| **SUPER_ADMIN** | Full system control, create/delete admins | Level 4 |
| **ELECTION_ADMIN** | Manage elections, candidates, view results | Level 3 |
| **SYSTEM_AUDITOR** | View-only access to all data, audit logs | Level 2 |
| **SUPPORT_STAFF** | Limited support functions, no data modification | Level 1 |

### Admin Creation Workflow

```bash
# 1. Login as SUPER_ADMIN
# 2. Navigate to Admin Dashboard → User Management Tab
# 3. Click "Create New Admin"
# 4. Fill form:
#    - Email: admin@example.com
#    - Admin Type: ELECTION_ADMIN
# 5. System generates temporary password (shown once)
# 6. Send credentials to new admin
# 7. New admin logs in → forced to change password
```

### Security Features

- ✅ **Invite-Only Registration**: No public admin signup
- ✅ **Temporary Passwords**: Auto-generated, 16-character secure passwords
- ✅ **Forced Password Change**: First login requires password update
- ✅ **Account Disabling**: SUPER_ADMIN can disable accounts without deletion
- ✅ **Self-Protection**: Admins cannot disable/delete themselves
- ✅ **Audit Trail**: All admin actions logged with timestamps
- ✅ **Role-Based Middleware**: API routes protected by admin_type

### Admin Management API

```javascript
// Create Admin (SUPER_ADMIN only)
POST /api/admin/create-admin
{
  "email": "newadmin@example.com",
  "admin_type": "ELECTION_ADMIN"
}

// List All Admins (SUPER_ADMIN only)
GET /api/admin/list-admins

// Reset Admin Password (SUPER_ADMIN only)
POST /api/admin/reset-password/:admin_id

// Disable Admin Account (SUPER_ADMIN only)
POST /api/admin/disable/:admin_id

// Delete Admin Account (SUPER_ADMIN only)
DELETE /api/admin/delete/:admin_id

// Change Own Password (All Admins)
POST /api/admin/change-password
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register Voter
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "voter@example.com",
  "password": "SecurePass123",
  "faceDescriptor": [array_of_128_numbers]
}

Response:
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "email": "voter@example.com",
    "voter_id": "VOTER-1733404800000-abc123"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "voter@example.com",
  "password": "SecurePass123",
  "faceDescriptor": [array_of_128_numbers]
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "voter@example.com",
    "role": "voter"
  }
}
```

### Election Endpoints

#### Get Active Elections
```http
GET /api/elections/active
Authorization: Bearer <token>

Response:
[
  {
    "id": 1,
    "title": "General Election 2025",
    "description": "National parliamentary elections",
    "start_date": "2025-01-01T00:00:00Z",
    "end_date": "2025-01-15T23:59:59Z",
    "status": "active"
  }
]
```

#### Create Election (Admin)
```http
POST /api/elections
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Student Council Election",
  "description": "Annual student body election",
  "start_date": "2025-02-01T00:00:00Z",
  "end_date": "2025-02-07T23:59:59Z"
}
```

### Voting Endpoints

#### Cast Encrypted Vote
```http
POST /api/vote/encrypted
Authorization: Bearer <token>
Content-Type: application/json

{
  "electionId": 1,
  "candidateId": 3,
  "encryptedVote": "base64_encrypted_data",
  "blockchainTxHash": "0x1234...abcd"
}

Response:
{
  "message": "Vote cast successfully",
  "receipt": {
    "receiptHash": "abc123def456...",
    "qrCodeData": "data:image/png;base64,...",
    "blockchainTxHash": "0x1234...abcd"
  }
}
```

#### Verify Vote Receipt
```http
POST /api/vote/verify-receipt
Content-Type: application/json

{
  "receiptHash": "abc123def456..."
}

Response:
{
  "verified": true,
  "election": "General Election 2025",
  "votedAt": "2025-01-05T10:30:00Z",
  "blockchainTxHash": "0x1234...abcd"
}
```

### Candidate Endpoints

#### Add Candidate (Admin)
```http
POST /api/candidates
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

{
  "electionId": 1,
  "name": "John Doe",
  "party": "Progressive Party",
  "manifesto": "Economic reform and education...",
  "photo": <file>
}
```

### Analytics Endpoints

#### Get Election Analytics
```http
GET /api/analytics/:electionId
Authorization: Bearer <token>

Response:
{
  "totalVotes": 15234,
  "turnoutRate": 67.5,
  "votesByCandidate": [
    { "candidateId": 1, "name": "John Doe", "votes": 8500 },
    { "candidateId": 2, "name": "Jane Smith", "votes": 6734 }
  ],
  "votingTrend": [...]
}
```

---

## 🧪 Testing

### Unit Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Integration Tests

```bash
# Test blockchain integration
cd backend
npm run test:blockchain

# Test API endpoints
npm run test:api
```

### Manual Testing Checklist

- [ ] Voter registration with face capture
- [ ] Admin login with valid credentials
- [ ] Election creation with future dates
- [ ] Candidate addition with photo upload
- [ ] Vote casting with blockchain confirmation
- [ ] QR code generation and scanning
- [ ] Receipt verification
- [ ] Analytics dashboard loading
- [ ] Language switching (English ↔ Hindi)
- [ ] Dark/Light mode toggle
- [ ] Admin creation (SUPER_ADMIN only)
- [ ] Password change flow

---

## 🚢 Production Deployment

### Prerequisites
- Ubuntu 20.04 LTS or higher
- Domain name with SSL certificate
- PostgreSQL production database
- Ethereum Mainnet wallet with ETH (or use Sepolia for staging)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

### 2. Clone and Configure

```bash
# Clone repository
git clone https://github.com/your-org/securevotex.git
cd securevotex

# Install dependencies
cd backend && npm ci --production
cd ../frontend && npm ci --production

# Build frontend
npm run build

# Setup environment variables
cp .env.example .env
nano .env  # Update with production values
```

### 3. Database Migration

```bash
cd backend
npx knex migrate:latest --env production

# Create super admin
node create-superadmin.js
```

### 4. Deploy Smart Contract (Mainnet)

```bash
# Update hardhat.config.js with mainnet settings
npx hardhat run scripts/deploy.js --network mainnet

# Verify on Etherscan
npx hardhat verify --network mainnet <CONTRACT_ADDRESS>
```

### 5. Configure Nginx

```nginx
# /etc/nginx/sites-available/securevotex
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        root /var/www/securevotex/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Upload files
    location /uploads {
        alias /var/www/securevotex/backend/uploads;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/securevotex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 7. Start Application with PM2

```bash
cd /var/www/securevotex/backend

# Start backend
pm2 start src/server.js --name securevotex-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 8. Monitoring

```bash
# View logs
pm2 logs securevotex-api

# Monitor resources
pm2 monit

# Restart application
pm2 restart securevotex-api
```

### 9. Database Backup

```bash
# Create backup script
cat > /opt/backup-db.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U postgres dvs > /opt/backups/dvs_$TIMESTAMP.sql
find /opt/backups -name "dvs_*.sql" -mtime +7 -delete
EOF

chmod +x /opt/backup-db.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /opt/backup-db.sh
```

### 10. Security Hardening

```bash
# Configure firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd

# Install fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

---

## 🔒 Security Best Practices

### Application Security

1. **Environment Variables**
   - Never commit `.env` files to Git
   - Use different secrets for dev/staging/prod
   - Rotate JWT secrets periodically

2. **Password Security**
   - Enforce minimum 8 characters
   - Require uppercase, lowercase, number, special char
   - Use bcrypt with 10+ rounds
   - Implement password history (prevent reuse)

3. **API Security**
   - Enable CORS only for trusted origins
   - Implement rate limiting (express-rate-limit)
   - Use helmet.js for security headers
   - Sanitize all user inputs

4. **Database Security**
   - Use parameterized queries (Knex.js)
   - Encrypt sensitive data at rest
   - Regular backups with encryption
   - Principle of least privilege for DB users

5. **Blockchain Security**
   - Never expose private keys
   - Use hardware wallets for production
   - Implement multi-signature wallets for admin actions
   - Audit smart contracts before deployment

### Code Security

```javascript
// ✅ Good: Parameterized query
const users = await knex('users').where({ email });

// ❌ Bad: String concatenation (SQL injection risk)
const users = await knex.raw(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ Good: Input validation
const { email, password } = req.body;
if (!email || !password) {
  return res.status(400).json({ error: 'Missing fields' });
}

// ✅ Good: JWT verification
const token = req.headers.authorization?.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Verify credentials
psql -U postgres -d dvs

# Check .env variables
cat backend/.env | grep DB_
```

#### 2. Blockchain Transaction Failed
```bash
# Check network connectivity
curl https://sepolia.infura.io/v3/$INFURA_API_KEY

# Verify contract address
# Check Etherscan: https://sepolia.etherscan.io/address/<CONTRACT_ADDRESS>

# Ensure wallet has ETH
# Get testnet ETH: https://sepoliafaucet.com
```

#### 3. Face Recognition Not Working
```bash
# Verify models downloaded
ls frontend/public/models/

# Check browser console for errors
# Ensure HTTPS (face-api.js requires secure context)

# Test with different lighting conditions
```

#### 4. JWT Token Expired
```javascript
// Frontend: Implement token refresh
const refreshToken = async () => {
  const response = await axios.post('/api/auth/refresh', {
    refreshToken: localStorage.getItem('refreshToken')
  });
  localStorage.setItem('token', response.data.token);
};
```

### Debug Mode

```bash
# Backend debug
DEBUG=* npm run dev

# Frontend debug
REACT_APP_DEBUG=true npm start
```

### Logs

```bash
# Backend logs
tail -f backend/logs/app.log

# PM2 logs (production)
pm2 logs securevotex-api --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## 📊 Performance Optimization

### Frontend Optimization

```javascript
// Code splitting
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Memoization
const MemoizedChart = React.memo(ChartComponent);

// Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';
```

### Backend Optimization

```javascript
// Database indexing
knex.schema.table('votes', (table) => {
  table.index('election_id');
  table.index('user_id');
  table.index(['election_id', 'user_id']);
});

// Caching
const redis = require('redis');
const client = redis.createClient();

app.get('/api/elections/active', async (req, res) => {
  const cached = await client.get('active_elections');
  if (cached) return res.json(JSON.parse(cached));
  
  const elections = await knex('elections').where('status', 'active');
  await client.setex('active_elections', 300, JSON.stringify(elections));
  res.json(elections);
});
```

### Blockchain Optimization

```solidity
// Gas optimization: Use uint256 instead of smaller types in storage
// Use events for data retrieval instead of storage arrays
// Batch transactions when possible
```

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style

- **JavaScript**: ESLint with Airbnb config
- **React**: Functional components with Hooks
- **Naming**: camelCase for variables, PascalCase for components
- **Comments**: JSDoc for functions

### Commit Messages

```
feat: Add voter analytics dashboard
fix: Resolve blockchain transaction timeout
docs: Update API documentation
style: Format code with Prettier
refactor: Optimize database queries
test: Add unit tests for auth controller
```

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 SecureVoteX

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support

- **Documentation**: [https://docs.securevotex.com](https://docs.securevotex.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/securevotex/issues)
- **Email**: support@securevotex.com
- **Discord**: [Join Community](https://discord.gg/securevotex)

---

## 🙏 Acknowledgments

- **Ethereum Foundation** - Blockchain infrastructure
- **face-api.js** - AI facial recognition
- **OpenZeppelin** - Secure smart contract libraries
- **React Team** - Frontend framework
- **PostgreSQL** - Reliable database system

---

**Built with ❤️ for Democratic Governance**

*SecureVoteX - Where Every Vote Counts, Verified on the Blockchain*
