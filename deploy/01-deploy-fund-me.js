const { network } = require("hardhat");

async function deployFun({getNamedAccount, deployments}){
    const {deploy, log}  = deployments;
    const {deployer} = await getNamedAccount();
    const address="0x694AA1769357215DE4FAC081bf1f309aDC325306";
    const chainId= network.config.chainId;

    const fundMe = deploy("FundMe",{
        from: deployer,
        args:[address],
        log:true
    })
}

module.exports.default = deployFun;