const networkConfig ={
    5:{
        name:"Goerli",
        ethUsdPriceFeed:"0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
    58008:{
        name:"Sepolia",
        ethUsdPriceFeed:"0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
    }
}

const developmentChains =["hardhat", "localhost"]
const DECIMALS =8;
const INITIAL_ANSWER = 200000000;

module.exports ={networkConfig,developmentChains,DECIMALS,INITIAL_ANSWER}