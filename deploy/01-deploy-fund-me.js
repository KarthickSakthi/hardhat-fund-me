const { network } = require("hardhat");
const {networkConfig, developmentChains} = require("../helper-hardhat-config");

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
    await deploy("FundMe",{
        from: deployer,
        args:[ethUsdPriceFeedAddress],
        log:true
    })
    log("Deployed!");
    log("-----------------------------------------");
}

module.exports.default = deployFun;
module.exports.tags=["all", "fundMe"]