const PriceConsumerV3 = artifacts.require("PriceConsumerV3");
const PriceConsumer2V3 = artifacts.require("PriceConsumer2V3");
const Wallet = artifacts.require("Wallet");
const MyToken = artifacts.require("MyToken");

const ethUsdContract = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
const azukiPriceContract = "0xA8B9A447C73191744D5B79BcE864F343455E1150";

const tokenName = "Token Test";
const tokenSym = "TT1";
const amount = 100;

module.exports = async(deployer, network, account) => {
    await deployer.deploy(PriceConsumerV3, ethUsdContract);
    const priceConsumer = await PriceConsumerV3.deployed();
    console.log("Deployed EthUsd is @: ", priceConsumer.address);

    await deployer.deploy(PriceConsumer2V3, azukiPriceContract);
    const priceConsumer2 = await PriceConsumer2V3.deployed();
    console.log("Deployed AzukiUsd is @: ", priceConsumer2.address);

    await deployer.deploy(Wallet, ethUsdContract, azukiPriceContract);
    const wallet = await Wallet.deployed();
    console.log("Deployed wallet is @: ", wallet.address);

    await deployer.deploy(MyToken, tokenName, tokenSym, amount);
    const mytoken = await MyToken.deployed();
    console.log("Deployed myToken is @: ", mytoken.address);
}