const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Starting Voting Contract Deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy Voting Contract
  console.log("📝 Deploying Voting Contract...");
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  
  await voting.waitForDeployment();
  const contractAddress = await voting.getAddress();

  console.log("✅ Voting Contract deployed to:", contractAddress);
  console.log("⛓️  Network:", hre.network.name);
  console.log("🔗 Block Number:", await hre.ethers.provider.getBlockNumber());

  // Save contract address to file
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    chainId: hre.network.config.chainId
  };

  const deploymentPath = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentPath, `${hre.network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n📄 Deployment info saved to:", `deployments/${hre.network.name}.json`);

  // Copy ABI to frontend
  const artifactPath = path.join(__dirname, '../artifacts/contracts/Voting.sol/Voting.json');
  const frontendABIPath = path.join(__dirname, '../../frontend/src/abi/Voting.json');
  
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const abiData = {
      abi: artifact.abi,
      contractAddress: contractAddress,
      network: hre.network.name
    };
    
    fs.writeFileSync(frontendABIPath, JSON.stringify(abiData, null, 2));
    console.log("✅ ABI copied to frontend/src/abi/Voting.json");
  }

  // Verify contract on Etherscan (for public networks)
  if (hre.network.name === 'sepolia' || hre.network.name === 'mumbai') {
    console.log("\n⏳ Waiting 30 seconds before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    try {
      console.log("🔍 Verifying contract on Etherscan...");
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: []
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.log("⚠️  Verification failed:", error.message);
    }
  }

  console.log("\n🎉 Deployment Complete!");
  console.log("\n📋 Next Steps:");
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
