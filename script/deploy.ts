import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying VeilPrize contracts with account:", deployer ? deployer.address : "Local Dev");

  // 1. Deploy MockERC20 (cUSDT)
  const MockERC20Factory = await ethers.getContractFactory("MockERC20");
  const token = await MockERC20Factory.deploy("Confidential Prize Token", "cUSDT", 6);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("MockERC20 (cUSDT) deployed to:", tokenAddress);

  // 2. Deploy MockYieldSource
  const MockYieldSourceFactory = await ethers.getContractFactory("MockYieldSource");
  const yieldSource = await MockYieldSourceFactory.deploy(tokenAddress);
  await yieldSource.waitForDeployment();
  const yieldSourceAddress = await yieldSource.getAddress();
  console.log("MockYieldSource deployed to:", yieldSourceAddress);

  // 3. Deploy VeilPrizePool
  const VeilPrizePoolFactory = await ethers.getContractFactory("VeilPrizePool");
  const prizePool = await VeilPrizePoolFactory.deploy(tokenAddress);
  await prizePool.waitForDeployment();
  const prizePoolAddress = await prizePool.getAddress();
  console.log("VeilPrizePool deployed to:", prizePoolAddress);

  // 4. Link contracts
  await yieldSource.setPrizePool(prizePoolAddress);
  await prizePool.setYieldSource(yieldSourceAddress);
  console.log("Linked YieldSource & VeilPrizePool successfully!");

  console.log("\n--- Deployment Summary ---");
  console.log(`cUSDT Token:   ${tokenAddress}`);
  console.log(`Yield Source:  ${yieldSourceAddress}`);
  console.log(`Prize Pool:    ${prizePoolAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
