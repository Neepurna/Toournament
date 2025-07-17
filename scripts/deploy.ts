import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Starting deployment to network:", (await ethers.provider.getNetwork()).name);
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // Deploy Mock USDT first
  console.log("\n1️⃣ Deploying Mock USDT...");
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy(deployer.address);
  await usdt.waitForDeployment();
  const usdtAddress = await usdt.getAddress();
  console.log("✅ Mock USDT deployed to:", usdtAddress);

  // Deploy QuizNFT
  console.log("\n2️⃣ Deploying QuizNFT...");
  const QuizNFT = await ethers.getContractFactory("QuizNFT");
  const quizNFT = await QuizNFT.deploy(deployer.address);
  await quizNFT.waitForDeployment();
  const nftAddress = await quizNFT.getAddress();
  console.log("✅ QuizNFT deployed to:", nftAddress);

  // Deploy TournamentFactory
  console.log("\n3️⃣ Deploying TournamentFactory...");
  const TournamentFactory = await ethers.getContractFactory("TournamentFactory");
  const factory = await TournamentFactory.deploy(usdtAddress, deployer.address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("✅ TournamentFactory deployed to:", factoryAddress);

  // Set up NFT minting authorization
  console.log("\n4️⃣ Setting up permissions...");
  await quizNFT.setAuthorizedMinter(factoryAddress, true);
  console.log("✅ Factory authorized as NFT minter");

  // Create deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      MockUSDT: {
        address: usdtAddress,
        name: "Mock USDT Token",
        symbol: "USDT",
        decimals: 6
      },
      QuizNFT: {
        address: nftAddress,
        name: "Quiz Achievement NFTs",
        symbol: "QNFT"
      },
      TournamentFactory: {
        address: factoryAddress,
        name: "Tournament Factory",
        platformFeePercentage: 20
      }
    },
    transactions: {
      usdt: usdt.deploymentTransaction()?.hash,
      nft: quizNFT.deploymentTransaction()?.hash,
      factory: factory.deploymentTransaction()?.hash
    }
  };

  // Save deployment info
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const network = (await ethers.provider.getNetwork()).name;
  const deploymentFile = path.join(deploymentsDir, `${network}-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  // Create frontend config
  const frontendConfig = {
    CHAIN_ID: deploymentInfo.chainId,
    RPC_URL: process.env.RPC_URL || "",
    CONTRACTS: {
      USDT_ADDRESS: usdtAddress,
      TOURNAMENT_FACTORY_ADDRESS: factoryAddress,
      NFT_ADDRESS: nftAddress
    }
  };

  const frontendDir = path.join(__dirname, "../frontend");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(frontendDir, "config.json"),
    JSON.stringify(frontendConfig, null, 2)
  );

  console.log("\n🎉 Deployment completed!");
  console.log("📄 Deployment info saved to:", deploymentFile);
  console.log("⚙️ Frontend config saved to:", path.join(frontendDir, "config.json"));

  console.log("\n📋 Deployment Summary:");
  console.log("├── Mock USDT:", usdtAddress);
  console.log("├── QuizNFT:", nftAddress);
  console.log("└── TournamentFactory:", factoryAddress);

  console.log("\n🔧 Next steps:");
  console.log("1. Update your .env file with the contract addresses");
  console.log("2. Verify contracts on block explorer");
  console.log("3. Test the contracts with the provided scripts");
  console.log("4. Deploy the frontend to IPFS");

  // Test the deployment
  console.log("\n🧪 Running basic tests...");
  
  // Test USDT faucet
  const faucetTx = await usdt.faucet();
  await faucetTx.wait();
  const balance = await usdt.balanceOf(deployer.address);
  console.log("✅ USDT faucet test passed. Balance:", ethers.formatUnits(balance, 6), "USDT");

  // Test tournament creation
  const entryFee = ethers.parseUnits("10", 6); // 10 USDT
  const createTx = await factory.createTournament(
    entryFee,
    4, // max 4 players
    "Test Tournament",
    "Testing tournament creation"
  );
  await createTx.wait();
  console.log("✅ Tournament creation test passed");

  console.log("\n🚀 All systems ready! Your decentralized tournament platform is live!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
