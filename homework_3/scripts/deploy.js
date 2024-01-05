const hre = require("hardhat");

async function main(){
    const Images = await hre.ethers.getContractFactory("Images");
    const images = await Images.deploy();
    await images.waitForDeployment();
    console.log("Images deployd at: ", await images.getAddress());
}

main ()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })