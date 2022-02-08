const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crud", function () {
    it("should return empty array for `getPosts' when no value added", async function () {
        const Crud = await ethers.getContractFactory("Crud");
        const crud = await Crud.deploy();
        await crud.deployed();

        expect(await crud.getAllPosts()).to.length(0);
    });

    it("should return one element array for `getPosts' when excecuted `create` before", async function () {
        const [owner] = await ethers.getSigners();
        const Crud = await ethers.getContractFactory("Crud");
        const crud = await Crud.deploy();
        await crud.deployed();
        const message = "test";

        const createTx = await crud.create(message);
        await createTx.wait();

        const allPosts = await crud.getAllPosts();
        expect(allPosts).to.length(1);
        expect(allPosts[0].content).to.equal(message);
        expect(allPosts[0].createdBy).to.equal(owner.address);
    });

    it("should return two element array for `getPosts' when excecuted `create` two times before", async function () {
        const [owner, address1] = await ethers.getSigners();
        const Crud = await ethers.getContractFactory("Crud");
        const crud = await Crud.deploy();
        await crud.deployed();
        const message1 = "test";
        const message2 = "test2";

        const createTx1 = await crud.create(message1);
        await createTx1.wait();
        const createTx2 = await crud.connect(address1).create(message2);
        await createTx2.wait();

        const allPosts = await crud.getAllPosts();
        expect(allPosts).to.length(2);
        expect(allPosts[0].content).to.equal(message1);
        expect(allPosts[0].createdBy).to.equal(owner.address);
        expect(allPosts[1].content).to.equal(message2);
        expect(allPosts[1].createdBy).to.equal(address1.address);
    });
});
