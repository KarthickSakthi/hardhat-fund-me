const { network } = require("hardhat");
const {networkConfig, developmentChains} = require("../helper-hardhat-config");
const {verify} = require("../utils/verify");

async function deployFun({getNamedAccounts, deployments}){
    const {deploy, log}  = deployments;
    const {deployer} = await getNamedAccounts();
    // const address="0x694AA1769357215DE4FAC081bf1f309aDC325306";
    const chainId= network.config.chainId;

    let ethUsdPriceFeedAddress;
    log(" Deploying Fund me!");
    if(developmentChains.includes(network.name)){
        const ethUsdAggregator =  await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    }
    else{
      ethUsdPriceFeedAddress  = networkConfig[chainId]["ethUsdPriceFeed"];
    }
    let args = [ethUsdPriceFeedAddress];
   const fundMe =  await deploy("FundMe",{
        from: deployer,
        args:args,
        log:true
    })
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundMe.address, args)
    }
    log("Deployed!");
    log("-----------------------------------------");
}

module.exports.default = deployFun;
module.exports.tags=["all", "fundMe"]