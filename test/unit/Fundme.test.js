const { deployer, ethers, getNamedAccounts, deployments } = require("hardhat");
const { assert, expect } = require("chai");

describe("FundMe", async function () {
  let fundMe = null;
  let deployer = null;
  let mockV3Aggregator = null;
  const sendValue = ethers.utils.parseUnits("1");
  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("constructor", async function () {
    it("it sets the aggregator address correctly", async function () {
      let response = fundMe.priceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });

  describe("fund", async function () {
    it(
      ("Fails if you don't send enough ETH",
      async function () {
        await expect(fundMe.fund()).to.be.revertedWith(
          "ou need to spend more ETH!"
        );
      })
    );
    it("updated the amount funded data structure", async function () {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addresstoAmountFunded(deployer.address);
      assert.equal(response.toString(), sendValue.toString());
    });
    it("Add funder to array of Funders", async function () {
      await fundMe.fund({ value: sendValue });
      const funder = await fundMe.funders(0);
      assert.equal(funder, deployer);
    });
  });

  describe("withdraw", async function () {
    beforeEach(async function () {
      await fundMe.fund({ value: sendValue });
    });

    it("withdraw ETH from a single funder", async function () {
      let startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      let startingDeployerBalance = await fundMe.provider.getBalance(deployer);

      let transactionResponse = await fundMe.withdraw();
      let transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);
      let endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      let endingDeployerBalance = await fundMe.provider.getBalance(deployer);
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );
    });

    it("allow us to withdraw with multiple funders", async function () {
      //Arrange
      const accounts = await ethers.getSigners();
      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendValue });
      }

      //Act
      let startingDeployerBalance = await fundMe.provider.getBalance(deployer);

      let transactionResponse = await fundMe.withdraw();
      let transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);
      let endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      let endingDeployerBalance = await fundMe.provider.getBalance(deployer);

      //Assert
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );

      //Make sure that funders are reset properly
      await expect(fundMe.funders(0)).to.be.reverted;
      for (let i = 1; i < 6; i++) {
        assert.equal(
          await fundMe.addresstoAmountFunded(accounts[i].address),
          0
        );
      }
    });

    it("only allows the owner to withdraw", async function () {
      const accounts = await ethers.getSigners();
      const attcker = accounts[i];
      const attackerConnectedContract = await fundMe.connect(attacker);
      await expect(attackerConnectedContract.withdraw()).to.be.revertedWith(
        "FundMe__NotOwner"
      );
    });
  });
});
