const {BN, constants, expectEvent, expectRevert, time} = require("@openzeppelin/test-helpers");
const {web3} = require("@openzeppelin/test-helpers/src/setup");
const {ZERO_ADDRESS} = constants;

const { expect } = require("chai");

const PriceConsumerV3 = artifacts.require("PriceConsumerV3");
const PriceConsumer2V3 = artifacts.require("PriceConsumer2V3");
const Wallet = artifacts.require("Wallet");
const MyToken = artifacts.require("MyToken");

const fromWei = (x) => web3.utils.fromWei(x.toString());
const toWei = (x) => web3.utils.toWei(x.toString());
const fromWei8Dec = (x) => x / Math.pow(10, 8);
const toWei8Dec = (x) => x * Math.pow(10, 8);
const fromWei2Dec = (x) => x / Math.pow(10, 2);

const toWei2Dec = (x) => x * Math.pow(10, 2);

const fromWeiNDec = (x, decimals) => x / Math.pow(10, decimals);
const toWeiNDec = (x, decimals) => x * Math.pow(10, decimals);


contract("Wallet", function (accounts) {

    const [deployer, firstAccount, secondAccount, fakeOwner] = accounts;

    it("retrieve deployed contracts", async function () {

        priceConsumer = await PriceConsumerV3.deployed();
        expect(priceConsumer.address).to.be.not.equal(ZERO_ADDRESS);
        expect(priceConsumer.address).to.match(/0x[0-9a-fA-F]{40}/);

        priceConsumer2 = await PriceConsumer2V3.deployed();
        expect(priceConsumer2.address).to.be.not.equal(ZERO_ADDRESS);
        expect(priceConsumer2.address).to.match(/0x[0-9a-fA-F]{40}/);

        wallet = await Wallet.deployed();
        expect(wallet.address).to.be.not.equal(ZERO_ADDRESS);
        expect(wallet.address).to.match(/0x[0-9a-fA-F]{40}/);

        mytoken = await MyToken.deployed();
        expect(mytoken.address).to.be.not.equal(ZERO_ADDRESS);
        expect(mytoken.address).to.match(/0x[0-9a-fA-F]{40}/);

    });

    it("Eth Usd", async function () {
        console.log("1 ETH = " + fromWei8Dec(await priceConsumer.getLatestPrice()) + " USD");
    });

    it("Azuki Usd", async function () {
        console.log("1 Azuki = " + fromWeiNDec(await priceConsumer2.getLatestPrice(), 18) + " ETH");
        console.log(fromWeiNDec(await wallet.getNftPrice(), 18));
    });

    it("Convert eth in usd", async function () {
        await wallet.sendTransaction({from: firstAccount, value: toWei(2)});
        ret = await wallet.convertEthInUsd(firstAccount);
        console.log(fromWeiNDec(ret, 2));

        ret = await wallet.convertUsdInEth(500000);
        console.log(toWeiNDec(ret, 18));
    });

    it("Convert usd in eth", async function () {
        ret = await wallet.convertUsdInEth(500000);
        console.log(toWeiNDec(ret, 18));
    });

    it("Convert token in usd", async function () {
        ret = await wallet.convertNftPriceInUsd();
        console.log(fromWeiNDec(ret, 2));   
    });

    it("Convert eth in usd", async function () {
        ret = await wallet.convertUsdInToken(toWeiNDec(5000, 2));
        console.log(fromWeiNDec(ret, 18));  
    });
    
});