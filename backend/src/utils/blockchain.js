const Web3 = require('web3');
// const contractABI = require('../../contracts/Voting.json').abi;
// const contractAddress = process.env.CONTRACT_ADDRESS;

// For local development, connect to Ganache/Hardhat
const web3 = new Web3('http://127.0.0.1:8545');

// const contract = new web3.eth.Contract(contractABI, contractAddress);

module.exports = { web3 /*, contract */ };
