const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Contract", function () {
  let nft;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await nft.name()).to.equal("NFT Marketplace Token");
      expect(await nft.symbol()).to.equal("NFTM");
    });

    it("Should start with 0 total supply", async function () {
      expect(await nft.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    const tokenURI = "ipfs://QmTest123";

    it("Should mint NFT successfully", async function () {
      await expect(nft.connect(addr1).mintNFT(addr1.address, tokenURI))
        .to.emit(nft, "NFTMinted")
        .withArgs(1, addr1.address, tokenURI);

      expect(await nft.ownerOf(1)).to.equal(addr1.address);
      expect(await nft.tokenURI(1)).to.equal(tokenURI);
      expect(await nft.totalSupply()).to.equal(1);
    });

    it("Should not mint to zero address", async function () {
      await expect(
        nft.mintNFT(ethers.ZeroAddress, tokenURI)
      ).to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should not mint with empty URI", async function () {
      await expect(
        nft.mintNFT(addr1.address, "")
      ).to.be.revertedWith("Token URI cannot be empty");
    });

    it("Should track creator correctly", async function () {
      await nft.connect(addr1).mintNFT(addr2.address, tokenURI);
      expect(await nft.getCreator(1)).to.equal(addr1.address);
    });

    it("Should increment token IDs correctly", async function () {
      await nft.mintNFT(addr1.address, tokenURI);
      await nft.mintNFT(addr2.address, tokenURI);
      
      expect(await nft.totalSupply()).to.equal(2);
      expect(await nft.ownerOf(1)).to.equal(addr1.address);
      expect(await nft.ownerOf(2)).to.equal(addr2.address);
    });
  });

  describe("Token Ownership", function () {
    beforeEach(async function () {
      await nft.mintNFT(addr1.address, "ipfs://token1");
      await nft.mintNFT(addr1.address, "ipfs://token2");
      await nft.mintNFT(addr2.address, "ipfs://token3");
    });

    it("Should return correct balance", async function () {
      expect(await nft.balanceOf(addr1.address)).to.equal(2);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
    });

    it("Should return tokens of owner", async function () {
      const tokens = await nft.tokensOfOwner(addr1.address);
      expect(tokens.length).to.equal(2);
      expect(tokens[0]).to.equal(1);
      expect(tokens[1]).to.equal(2);
    });
  });

  describe("Transfers", function () {
    beforeEach(async function () {
      await nft.mintNFT(addr1.address, "ipfs://token1");
    });

    it("Should transfer NFT correctly", async function () {
      await expect(
        nft.connect(addr1).transferFrom(addr1.address, addr2.address, 1)
      ).to.emit(nft, "NFTTransferred")
        .withArgs(1, addr1.address, addr2.address);

      expect(await nft.ownerOf(1)).to.equal(addr2.address);
    });

    it("Should not transfer if not owner", async function () {
      await expect(
        nft.connect(addr2).transferFrom(addr1.address, addr2.address, 1)
      ).to.be.reverted;
    });
  });

  describe("Approvals", function () {
    beforeEach(async function () {
      await nft.mintNFT(addr1.address, "ipfs://token1");
    });

    it("Should approve correctly", async function () {
      await nft.connect(addr1).approve(addr2.address, 1);
      expect(await nft.getApproved(1)).to.equal(addr2.address);
    });

    it("Should allow approved address to transfer", async function () {
      await nft.connect(addr1).approve(addr2.address, 1);
      await nft.connect(addr2).transferFrom(addr1.address, addr2.address, 1);
      expect(await nft.ownerOf(1)).to.equal(addr2.address);
    });
  });
});
