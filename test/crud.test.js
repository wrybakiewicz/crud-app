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

    it("should create & delete post", async function () {
        const Crud = await ethers.getContractFactory("Crud");
        const crud = await Crud.deploy();
        await crud.deployed();

        const createTx = await crud.create("test");
        await createTx.wait();
        const deleteTx = await crud.deletePost(0);
        await deleteTx.wait();

        const allPosts = await crud.getAllPosts();
        expect(allPosts).to.length(0);
    });

    it("should create two posts & delete one", async function () {
        const [owner] = await ethers.getSigners();
        const Crud = await ethers.getContractFactory("Crud");
        const crud = await Crud.deploy();
        await crud.deployed();
        const message = "message"

        const createTx1 = await crud.create("test");
        await createTx1.wait();
        const createTx2 = await crud.create(message);
        await createTx2.wait();
        const deleteTx = await crud.deletePost(0);
        await deleteTx.wait();

        const allPosts = await crud.getAllPosts();
        expect(allPosts).to.length(1);
        expect(allPosts[0].content).to.equal(message);
        expect(allPosts[0].createdBy).to.equal(owner.address);
        expect(allPosts[0].id).to.equal(1);
    });

    it("should create three posts & delete two", async function () {
        const [owner] = await ethers.getSigners();
        const Crud = await ethers.getContractFactory("Crud");
        const crud = await Crud.deploy();
        await crud.deployed();
        const message = "message"

        const createTx1 = await crud.create(message);
        await createTx1.wait();
        const createTx2 = await crud.create("test");
        await createTx2.wait();
        const createTx3 = await crud.create("test1");
        await createTx3.wait();
        const deleteTx1 = await crud.deletePost(1);
        await deleteTx1.wait();
        const deleteTx2 = await crud.deletePost(2);
        await deleteTx2.wait();

        const allPosts = await crud.getAllPosts();
        expect(allPosts).to.length(1);
        expect(allPosts[0].content).to.equal(message);
        expect(allPosts[0].createdBy).to.equal(owner.address);
        expect(allPosts[0].id).to.equal(0);
    });

    it("should create three posts & delete one", async function () {
        const [owner] = await ethers.getSigners();
        const Crud = await ethers.getContractFactory("Crud");
        const crud = await Crud.deploy();
        await crud.deployed();
        const message1 = "message1"
        const message2 = "message2"

        const createTx1 = await crud.create(message1);
        await createTx1.wait();
        const createTx2 = await crud.create("test");
        await createTx2.wait();
        const createTx3 = await crud.create(message2);
        await createTx3.wait();
        const deleteTx1 = await crud.deletePost(1);
        await deleteTx1.wait();

        const allPosts = await crud.getAllPosts();
        expect(allPosts).to.length(2);
        expect(allPosts[0].content).to.equal(message1);
        expect(allPosts[0].createdBy).to.equal(owner.address);
        expect(allPosts[0].id).to.equal(0);
        expect(allPosts[1].content).to.equal(message2);
        expect(allPosts[1].createdBy).to.equal(owner.address);
        expect(allPosts[1].id).to.equal(2);
    });

});
