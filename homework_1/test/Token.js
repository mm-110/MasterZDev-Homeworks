// npx hardhat test test/Token.js

const { expect } = require("chai");
const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { constants, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants.ZERO_ADDRESS;

describe("Token", function () {
    let BlackList, blacklist, blacklistOwner, Token, token, tokenAddress, owner, addr1, addr2, blackListContractAddress;

    beforeEach(async function () {

        BlackList = await hre.ethers.getContractFactory("BlackList");
        [blacklistOwner, _, _, _] = await ethers.getSigners();
        blacklist = await BlackList.deploy();
        await blacklist.waitForDeployment();
        blackListContractAddress = await blacklist.getAddress();

        console.log(blackListContractAddress);

        Token = await ethers.getContractFactory("Token");
        [owner, addr1, addr2, _] = await ethers.getSigners();
        token = await Token.deploy("Token Name", "TKN", blackListContractAddress);
        await token.waitForDeployment();
        tokenAddress = await token.getAddress();
        console.log(tokenAddress);
    });

    describe("Deploy", function(){
        it("Sould be deployed correctly", async function () {
            expect(blackListContractAddress).to.not.equal(ZERO_ADDRESS);
            expect(blackListContractAddress).to.match(/0x[0-9a-fA-F]{40}/);
            expect(tokenAddress).to.not.equal(ZERO_ADDRESS);
            expect(tokenAddress).to.match(/0x[0-9a-fA-F]{40}/);
        });
    });

    describe("Transfer", function(){
        it("Should transfer the correct amount", async function() {
            await token.connect(owner).mint(await addr1.getAddress(), web3.utils.toWei("100"));
            await token.connect(owner).mint(await addr2.getAddress(), web3.utils.toWei("50"));
            await token.connect(owner).mint(await owner.getAddress(), web3.utils.toWei("1000"));
            expect(await token.balanceOf(await addr1.getAddress())).to.equal(web3.utils.toWei("100"));
            expect(await token.balanceOf(await addr2.getAddress())).to.equal(web3.utils.toWei("50"));
            expect(await token.balanceOf(await owner.getAddress())).to.equal(web3.utils.toWei("1000"));
        });
    });

    describe("Transfer From", function(){
        it("Should transfer the correct amount", async function() {
            console.log(await owner.getAddress());
            console.log(await addr2.getAddress());

            await token.connect(owner).mint(await owner.getAddress(), web3.utils.toWei("1000"));
            expect(await token.balanceOf(await owner.getAddress())).to.equal(web3.utils.toWei("1000"));
            await token.connect(owner).approve(await addr1.getAddress(), web3.utils.toWei("100"));
            await token.connect(owner).transfer(await addr1.getAddress(), web3.utils.toWei("100"));
            expect(await token.balanceOf(await addr1.getAddress())).to.equal(web3.utils.toWei("100"));
            expect(await token.balanceOf(await owner.getAddress())).to.equal(web3.utils.toWei("900"));

            await token.connect(addr1).approve(await addr2.getAddress(), web3.utils.toWei("50"));
            await token.connect(addr2).transferFrom(await addr1.getAddress(), await addr2.getAddress(), web3.utils.toWei("50"));
            expect(await token.balanceOf(await addr1.getAddress())).to.equal(web3.utils.toWei("50"));

            // expect(await token.balanceOf(await owner.getAddress())).to.equal(web3.utils.toWei("900"));
            // await token.transferFrom(await addr1.getAddress(), await addr2.getAddress(), web3.utils.toWei("50"), {from: addr2});
            // expect(await token.balanceOf(await addr1.getAddress())).to.equal(web3.utils.toWei("250"));
            // expect(await token.balanceOf(await owner.getAddress())).to.equal(web3.utils.toWei("0"));
            
        });
    });  

    describe("Allow Token", function () {
        it("Should grant Token blacklist permissions", async function() {
            await blacklist.connect(blacklistOwner).allowedToken(tokenAddress);
            await token.connect(owner).insertInBlacklist(addr2);
            console.log(await blacklist.getBlacklistStatus(addr2));
        })
    });

    describe("Transfer to Evil User", function () {
        it("Should Revert", async function() {
            await blacklist.connect(blacklistOwner).allowedToken(tokenAddress);
            await token.connect(owner).insertInBlacklist(addr2);
            console.log(await blacklist.getBlacklistStatus(addr2));
            await token.connect(owner).mint(await owner.getAddress(), web3.utils.toWei("1000"));
            await expectRevert(token.connect(owner).transfer(addr2, web3.utils.toWei("100")), "Blacklisted Address");
        })
    });
});