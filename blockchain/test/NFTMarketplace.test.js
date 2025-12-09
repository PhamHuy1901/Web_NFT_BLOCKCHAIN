const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace Contract", function () {
  let nft, marketplace;
  let owner, seller, buyer, addr3;
  const tokenURI = "ipfs://QmTest123";
  const price = ethers.parseEther("1.0"); // 1 ETH

  beforeEach(async function () {
    [owner, seller, buyer, addr3] = await ethers.getSigners();
    
    // Deploy NFT Contract
    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.waitForDeployment();

    // Deploy Marketplace Contract
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    marketplace = await NFTMarketplace.deploy(await nft.getAddress());
    await marketplace.waitForDeployment();

    // Mint NFT for seller
    await nft.connect(seller).mintNFT(seller.address, tokenURI);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await marketplace.owner()).to.equal(owner.address);
    });

    it("Should set correct NFT contract address", async function () {
      expect(await marketplace.nftContract()).to.equal(await nft.getAddress());
    });

    it("Should have correct initial marketplace fee", async function () {
      expect(await marketplace.marketplaceFee()).to.equal(250); // 2.5%
    });
  });

  describe("Listing NFT", function () {
    it("Should list NFT successfully", async function () {
      // Approve marketplace
      await nft.connect(seller).approve(await marketplace.getAddress(), 1);

      // List NFT
      await expect(marketplace.connect(seller).listNFT(1, price))
        .to.emit(marketplace, "NFTListed")
        .withArgs(1, seller.address, price);

      const listing = await marketplace.getNFTListing(1);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(price);
      expect(listing.isListed).to.equal(true);
    });

    it("Should not list if price is 0", async function () {
      await nft.connect(seller).approve(await marketplace.getAddress(), 1);
      await expect(
        marketplace.connect(seller).listNFT(1, 0)
      ).to.be.revertedWith("Price must be greater than 0");
    });

    it("Should not list if not token owner", async function () {
      await expect(
        marketplace.connect(buyer).listNFT(1, price)
      ).to.be.revertedWith("Not token owner");
    });

    it("Should not list without approval", async function () {
      await expect(
        marketplace.connect(seller).listNFT(1, price)
      ).to.be.revertedWith("Marketplace not approved");
    });

    it("Should not list already listed NFT", async function () {
      await nft.connect(seller).approve(await marketplace.getAddress(), 1);
      await marketplace.connect(seller).listNFT(1, price);
      
      await expect(
        marketplace.connect(seller).listNFT(1, price)
      ).to.be.revertedWith("Already listed");
    });
  });

  describe("Buying NFT", function () {
    beforeEach(async function () {
      await nft.connect(seller).approve(await marketplace.getAddress(), 1);
      await marketplace.connect(seller).listNFT(1, price);
    });

    it("Should buy NFT successfully", async function () {
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      
      await expect(
        marketplace.connect(buyer).buyNFT(1, { value: price })
      ).to.emit(marketplace, "NFTSold")
        .withArgs(1, seller.address, buyer.address, price);

      // Check NFT ownership
      expect(await nft.ownerOf(1)).to.equal(buyer.address);

      // Check listing removed
      const listing = await marketplace.getNFTListing(1);
      expect(listing.isListed).to.equal(false);

      // Check seller received payment (minus fee)
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      const fee = (price * BigInt(250)) / BigInt(10000); // 2.5%
      const expectedAmount = price - fee;
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(expectedAmount);
    });

    it("Should not buy with insufficient payment", async function () {
      await expect(
        marketplace.connect(buyer).buyNFT(1, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should not buy own NFT", async function () {
      await expect(
        marketplace.connect(seller).buyNFT(1, { value: price })
      ).to.be.revertedWith("Cannot buy your own NFT");
    });

    it("Should not buy unlisted NFT", async function () {
      await expect(
        marketplace.connect(buyer).buyNFT(2, { value: price })
      ).to.be.revertedWith("NFT not listed");
    });

    it("Should refund excess payment", async function () {
      const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);
      const overpayment = ethers.parseEther("2.0");
      
      const tx = await marketplace.connect(buyer).buyNFT(1, { value: overpayment });
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);
      
      // Should only pay the listing price + gas
      const actualSpent = buyerBalanceBefore - buyerBalanceAfter;
      expect(actualSpent).to.be.closeTo(price + gasUsed, ethers.parseEther("0.01"));
    });

    it("Should update marketplace statistics", async function () {
      await marketplace.connect(buyer).buyNFT(1, { value: price });
      
      expect(await marketplace.totalVolume()).to.equal(price);
      const expectedFee = (price * BigInt(250)) / BigInt(10000);
      expect(await marketplace.totalFees()).to.equal(expectedFee);
    });
  });

  describe("Cancel Listing", function () {
    beforeEach(async function () {
      await nft.connect(seller).approve(await marketplace.getAddress(), 1);
      await marketplace.connect(seller).listNFT(1, price);
    });

    it("Should cancel listing successfully", async function () {
      await expect(marketplace.connect(seller).cancelListing(1))
        .to.emit(marketplace, "ListingCancelled")
        .withArgs(1, seller.address);

      const listing = await marketplace.getNFTListing(1);
      expect(listing.isListed).to.equal(false);
    });

    it("Should not cancel if not seller", async function () {
      await expect(
        marketplace.connect(buyer).cancelListing(1)
      ).to.be.revertedWith("Not the seller");
    });

    it("Should not cancel unlisted NFT", async function () {
      await expect(
        marketplace.connect(seller).cancelListing(2)
      ).to.be.revertedWith("NFT not listed");
    });
  });

  describe("Update Price", function () {
    const newPrice = ethers.parseEther("2.0");

    beforeEach(async function () {
      await nft.connect(seller).approve(await marketplace.getAddress(), 1);
      await marketplace.connect(seller).listNFT(1, price);
    });

    it("Should update price successfully", async function () {
      await expect(marketplace.connect(seller).updatePrice(1, newPrice))
        .to.emit(marketplace, "PriceUpdated")
        .withArgs(1, price, newPrice);

      const listing = await marketplace.getNFTListing(1);
      expect(listing.price).to.equal(newPrice);
    });

    it("Should not update to 0 price", async function () {
      await expect(
        marketplace.connect(seller).updatePrice(1, 0)
      ).to.be.revertedWith("Price must be greater than 0");
    });

    it("Should not update if not seller", async function () {
      await expect(
        marketplace.connect(buyer).updatePrice(1, newPrice)
      ).to.be.revertedWith("Not the seller");
    });
  });

  describe("Get All Listings", function () {
    it("Should return empty array initially", async function () {
      const listings = await marketplace.getAllListings();
      expect(listings.length).to.equal(0);
    });

    it("Should return all active listings", async function () {
      // Mint and list multiple NFTs
      await nft.connect(seller).mintNFT(seller.address, tokenURI);
      await nft.connect(seller).mintNFT(seller.address, tokenURI);

      await nft.connect(seller).approve(await marketplace.getAddress(), 1);
      await nft.connect(seller).approve(await marketplace.getAddress(), 2);
      await nft.connect(seller).approve(await marketplace.getAddress(), 3);

      await marketplace.connect(seller).listNFT(1, price);
      await marketplace.connect(seller).listNFT(2, price);
      await marketplace.connect(seller).listNFT(3, price);

      const listings = await marketplace.getAllListings();
      expect(listings.length).to.equal(3);
    });

    it("Should update count after buying", async function () {
      await nft.connect(seller).approve(await marketplace.getAddress(), 1);
      await marketplace.connect(seller).listNFT(1, price);

      expect(await marketplace.getListingCount()).to.equal(1);

      await marketplace.connect(buyer).buyNFT(1, { value: price });

      expect(await marketplace.getListingCount()).to.equal(0);
    });
  });

  describe("Marketplace Fee Management", function () {
    it("Should allow owner to update fee", async function () {
      const newFee = 500; // 5%
      await expect(marketplace.setMarketplaceFee(newFee))
        .to.emit(marketplace, "MarketplaceFeeUpdated")
        .withArgs(250, newFee);

      expect(await marketplace.marketplaceFee()).to.equal(newFee);
    });

    it("Should not allow fee higher than 10%", async function () {
      await expect(
        marketplace.setMarketplaceFee(1001)
      ).to.be.revertedWith("Fee too high");
    });

    it("Should not allow non-owner to update fee", async function () {
      await expect(
        marketplace.connect(seller).setMarketplaceFee(500)
      ).to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount");
    });
  });

  describe("Withdraw Fees", function () {
    beforeEach(async function () {
      // Create a sale to generate fees
      await nft.connect(seller).approve(await marketplace.getAddress(), 1);
      await marketplace.connect(seller).listNFT(1, price);
      await marketplace.connect(buyer).buyNFT(1, { value: price });
    });

    it("Should allow owner to withdraw fees", async function () {
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      const marketplaceBalance = await ethers.provider.getBalance(await marketplace.getAddress());
      
      const tx = await marketplace.withdrawFees();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      
      expect(ownerBalanceAfter - ownerBalanceBefore + gasUsed).to.equal(marketplaceBalance);
    });

    it("Should not allow non-owner to withdraw", async function () {
      await expect(
        marketplace.connect(seller).withdrawFees()
      ).to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount");
    });
  });
});
