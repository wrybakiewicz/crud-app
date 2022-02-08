const hre = require("hardhat");

async function main() {
    const Crud = await hre.ethers.getContractFactory("Crud");
    const crud = await Crud.deploy();

    await crud.deployed();

    console.log("Crud deployed to:", crud.address);

    saveFrontendFiles(crud);
}

function saveFrontendFiles(crud) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../frontend/src/contracts";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        contractsDir + "/contract-address.json",
        JSON.stringify({ Crud: crud.address }, undefined, 2)
    );

    const CrudArtifact = artifacts.readArtifactSync("Crud");

    fs.writeFileSync(
        contractsDir + "/Crud.json",
        JSON.stringify(CrudArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
