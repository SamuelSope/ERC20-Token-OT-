const {
  developmentChains,
  INITIAL_SUPPLY,
} = require("../helper-hardhat-config")

const { verify } = require("../utils/verify")

const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const arguments = [INITIAL_SUPPLY]

  const ourToken = await deploy("OurToken", {
    from: deployer,
    args: arguments,
    log: true,
    //We need to wait to see if we are on a live network so we can verify properly

    waitConfirmations: network.config.blockConfirmations || 1,
  })

  log(`ourToken deployed at ${ourToken.address}`)

  //Verifying the deployment

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...")
    await verify(ourToken.address, arguments)
  }
}

module.exports.tags = ["all", "token"]
