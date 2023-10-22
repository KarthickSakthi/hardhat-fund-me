const { network } = require("hardhat");
const {developmentChains, DECIMALS, INITIAL_ANSWER} = require("../helper-hardhat-config")
async function deployFun({getNamedAccounts, deployments}){
    const {deploy, log}  = deployments;
    const {deployer} = await getNamedAccounts();
   log("networkName", network.name)
    if(developmentChains.includes(network.name)){
        log("local network detected, Deploying!");
        await deploy("MockV3Aggregator",{
            contract: "MockV3Aggregator",
            from: deployer,
            log:true,
            args:[DECIMALS, INITIAL_ANSWER]
        })
    }
    log("Deployed!");
    log("-----------------------------------------");
}


module.exports.default = deployFun;
module.exports.tags=["all","mocks"]