const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crud", function () {
    it("should return empty array when no posts added", async function () {
        const Crud = await ethers.getContractFactory("Crud");
        const crud = await Crud.deploy();
        await crud.deployed();

        expect(await crud.getAllPosts()).to.length(0);
    });

    it("should create & return post", async function () {
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
        expect(allPosts[0].id).to.equal(0);
    });

    it("should create & return 2 posts", async function () {
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
        expect(allPosts[0].id).to.equal(0);
        expect(allPosts[1].content).to.equal(message2);
        expect(allPosts[1].createdBy).to.equal(address1.address);
        expect(allPosts[1].id).to.equal(1);
    });

    it("should create & update & return post", async function () {
        const [owner] = await ethers.getSigners();
        const Crud = await ethers.getContractFactory("Crud");
        const crud = await Crud.deploy();
        await crud.deployed();
        const message = "test";
        const newMessage = "new test";

        const createTx = await crud.create(message);
        await createTx.wait();
        const updateTx = await crud.update(0, newMessage);
        await updateTx.wait();

        const allPosts = await crud.getAllPosts();
        expect(allPosts).to.length(1);
        expect(allPosts[0].content).to.equal(newMessage);
        expect(allPosts[0].createdBy).to.equal(owner.address);
        expect(allPosts[0].id).to.equal(0);
    });

    it("should create & not let update someone else post", async function () {
        const [_, address1] = await ethers.getSigners();
        const Crud = await ethers.getContractFactory("Crud");
        const crud = await Crud.deploy();
        await crud.deployed();
        const message = "test";
        const newMessage = "new test";

        const createTx = await crud.create(message);
        await createTx.wait();

        await expect(crud.connect(address1).update(0, newMessage)).to.be.revertedWith("PostIdNotFound()");
    });

});
