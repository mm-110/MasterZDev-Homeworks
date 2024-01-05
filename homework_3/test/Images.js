require("@nomicfoundation/hardhat-chai-matchers");

const { expect } = require("chai");

let images;

describe("images test", function (accounts) {
    baseURI = "ipfs://QmXG3meHqjnxa9XjpTvxDrmSeMEWjQ7eSCSqoWJeUF4kPx"

    it("contract setup", async function() {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        
        const Images = await hre.ethers.getContractFactory("Images");
        images = await Images.deploy();
        await images.waitForDeployment();
        console.log("Images deployd at: ", await images.getAddress());
    })

    it("owner mints some token", async function () {

        images.connect(owner).mint(await addr1.getAddress(), 1, 2, "0x");
        images.connect(owner).mint(await addr1.getAddress(), 3, 2, "0x");

    })

    it("owner batch mints some token", async function() {
        images.connect(owner).mintBatch(await addr3.getAddress(), [1, 4, 5], [2, 1, 2], "0x");
    })
})