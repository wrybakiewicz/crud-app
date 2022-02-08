pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Crud {

    using EnumerableSet for EnumerableSet.AddressSet;

    mapping(address => Post[]) public addressPostsMap;
    uint private postIdCounter;
    EnumerableSet.AddressSet private addresses;

    struct Post {
        uint id;
        address createdBy;
        string content;
    }

    error PostIdNotFound();

    function create(string memory content) external {
        Post[] storage postsForAddress = addressPostsMap[msg.sender];
        uint nextId = postIdCounter;
        Post memory post = Post(nextId, msg.sender, content);

        addresses.add(msg.sender);
        postsForAddress.push(post);
        postIdCounter += 1;
    }

    function getAllPosts() public view returns (Post[] memory) {
        uint allPostsCount = getAllPostsCount();
        Post[] memory allPosts = new Post[](allPostsCount);
        uint counter;
        address[] memory allAddresses = getAddresses();
        for (uint i = 0; i < allAddresses.length; i++) {
            Post[] memory posts = addressPostsMap[allAddresses[i]];
            for (uint j = 0; j < posts.length; j++) {
                allPosts[counter] = posts[j];
                counter++;
            }
        }
        return allPosts;
    }

    function update(uint postId, string memory newContent) external {
        Post[] storage postsForAddress = addressPostsMap[msg.sender];
        uint postIndex = getPostIndex(postId, postsForAddress);
        postsForAddress[postIndex].content = newContent;
    }

    function getPostIndex(uint postId, Post[] storage posts) internal view returns (uint) {
        for (uint i=0; i< posts.length; i++) {
            if(posts[i].id == postId) {
                return i;
            }
        }
        revert PostIdNotFound();
    }

    function getAllPostsCount() internal view returns (uint) {
        uint count;
        address[] memory allAddresses = getAddresses();
        for (uint i = 0; i < allAddresses.length; i++) {
            Post[] memory posts = addressPostsMap[allAddresses[i]];
            for (uint j = 0; j < posts.length; j++) {
                count++;
            }
        }
        return count;
    }

    function getAddresses() internal view returns (address[] memory) {
        return addresses.values();
    }

}
