require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: "0.8.8",
 solidity:{
  compilers:[{version:"0.8.8"},{version:"0.6.6"}]
 },
  defaultNetwork: "hardhat",
  // networks:{
  //   mumbai:{
  //     url:"",
  //     chainId:"",
  //     accounts:[]
  //   }
  // },
  namedAccounts:{
    deployer:{
      default:0
    },
    user:{
      default:1
    }
  }
};
