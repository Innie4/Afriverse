// Unit tests for AfriverseTales contract
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AfriverseTales", function () {
  let afriverseTales;
  let owner;
  let addr1;
  let addr2;
  let royaltyRecipient;

  const name = "Afriverse Tales";
  const symbol = "AFRT";
  const royaltyFeeBps = 500; // 5%

  beforeEach(async function () {
    [owner, addr1, addr2, royaltyRecipient] = await ethers.getSigners();

    const AfriverseTales = await ethers.getContractFactory("AfriverseTales");
    afriverseTales = await AfriverseTales.deploy(
      name,
      symbol,
      royaltyRecipient.address,
      royaltyFeeBps
    );

    await afriverseTales.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await afriverseTales.name()).to.equal(name);
      expect(await afriverseTales.symbol()).to.equal(symbol);
    });

    it("Should set the right owner", async function () {
      expect(await afriverseTales.owner()).to.equal(owner.address);
    });

    it("Should set the right royalty recipient and fee", async function () {
      const [recipient, fee] = await afriverseTales.getRoyalties();
      expect(recipient).to.equal(royaltyRecipient.address);
      expect(fee).to.equal(royaltyFeeBps);
    });

    it("Should start with zero total supply", async function () {
      expect(await afriverseTales.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    const ipfsHash = "QmTestHash123456789";
    const tribe = "Yoruba";
    const language = "en";

    it("Should mint a story successfully", async function () {
      const tx = await afriverseTales.mintStory(addr1.address, ipfsHash, tribe, language);
      const receipt = await tx.wait();

      // Check event was emitted
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "StoryMinted"
      );
      expect(event).to.not.be.undefined;

      // Check token ID
      expect(await afriverseTales.totalSupply()).to.equal(1);
      expect(await afriverseTales.ownerOf(0)).to.equal(addr1.address);

      // Check metadata
      const metadata = await afriverseTales.getStoryMetadata(0);
      expect(metadata.author).to.equal(addr1.address);
      expect(metadata.tribe).to.equal(tribe);
      expect(metadata.language).to.equal(language);
      expect(metadata.ipfsHash).to.equal(ipfsHash);
    });

    it("Should emit StoryMinted event with correct parameters", async function () {
      await expect(afriverseTales.mintStory(addr1.address, ipfsHash, tribe, language))
        .to.emit(afriverseTales, "StoryMinted")
        .withArgs(0, ipfsHash, addr1.address, tribe, (value) => value > 0);
    });

    it("Should set correct token URI", async function () {
      await afriverseTales.mintStory(addr1.address, ipfsHash, tribe, language);
      const tokenURI = await afriverseTales.tokenURI(0);
      expect(tokenURI).to.equal(`ipfs://${ipfsHash}`);
    });

    it("Should increment token ID correctly", async function () {
      await afriverseTales.mintStory(addr1.address, ipfsHash, tribe, language);
      await afriverseTales.mintStory(addr2.address, "QmAnotherHash", "Igbo", "ig");
      
      expect(await afriverseTales.totalSupply()).to.equal(2);
      expect(await afriverseTales.ownerOf(0)).to.equal(addr1.address);
      expect(await afriverseTales.ownerOf(1)).to.equal(addr2.address);
    });

    it("Should reject minting to zero address", async function () {
      await expect(
        afriverseTales.mintStory(ethers.ZeroAddress, ipfsHash, tribe, language)
      ).to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should reject minting with empty IPFS hash", async function () {
      await expect(
        afriverseTales.mintStory(addr1.address, "", tribe, language)
      ).to.be.revertedWith("IPFS hash cannot be empty");
    });
  });

  describe("Admin Functions", function () {
    const ipfsHash = "QmTestHash123456789";
    const tribe = "Yoruba";
    const language = "en";

    it("Should allow owner to mint with custom author", async function () {
      await afriverseTales.mintStoryWithAuthor(
        addr1.address,
        ipfsHash,
        tribe,
        language,
        addr2.address
      );

      const metadata = await afriverseTales.getStoryMetadata(0);
      expect(metadata.author).to.equal(addr2.address);
      expect(await afriverseTales.ownerOf(0)).to.equal(addr1.address);
    });

    it("Should not allow non-owner to mint with custom author", async function () {
      await expect(
        afriverseTales.connect(addr1).mintStoryWithAuthor(
          addr1.address,
          ipfsHash,
          tribe,
          language,
          addr2.address
        )
      ).to.be.revertedWithCustomError(afriverseTales, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to update royalties", async function () {
      const newRecipient = addr2.address;
      const newFee = 750; // 7.5%

      await expect(afriverseTales.setRoyalties(newRecipient, newFee))
        .to.emit(afriverseTales, "RoyaltiesUpdated")
        .withArgs(newRecipient, newFee);

      const [recipient, fee] = await afriverseTales.getRoyalties();
      expect(recipient).to.equal(newRecipient);
      expect(fee).to.equal(newFee);
    });

    it("Should not allow non-owner to update royalties", async function () {
      await expect(
        afriverseTales.connect(addr1).setRoyalties(addr2.address, 500)
      ).to.be.revertedWithCustomError(afriverseTales, "OwnableUnauthorizedAccount");
    });

    it("Should reject invalid royalty recipient", async function () {
      await expect(
        afriverseTales.setRoyalties(ethers.ZeroAddress, 500)
      ).to.be.revertedWith("Invalid royalty recipient");
    });

    it("Should reject royalty fee exceeding 100%", async function () {
      await expect(
        afriverseTales.setRoyalties(addr1.address, 10001)
      ).to.be.revertedWith("Royalty fee exceeds 100%");
    });
  });

  describe("Metadata Retrieval", function () {
    const ipfsHash = "QmTestHash123456789";
    const tribe = "Yoruba";
    const language = "en";

    beforeEach(async function () {
      await afriverseTales.mintStory(addr1.address, ipfsHash, tribe, language);
    });

    it("Should return correct story metadata", async function () {
      const metadata = await afriverseTales.getStoryMetadata(0);
      expect(metadata.author).to.equal(addr1.address);
      expect(metadata.tribe).to.equal(tribe);
      expect(metadata.language).to.equal(language);
      expect(metadata.ipfsHash).to.equal(ipfsHash);
      expect(metadata.timestamp).to.be.gt(0);
    });

    it("Should return correct IPFS hash", async function () {
      const hash = await afriverseTales.getIPFSHash(0);
      expect(hash).to.equal(ipfsHash);
    });

    it("Should revert when querying non-existent token", async function () {
      await expect(afriverseTales.getStoryMetadata(999)).to.be.revertedWith("Token does not exist");
      await expect(afriverseTales.getIPFSHash(999)).to.be.revertedWith("Token does not exist");
    });
  });

  describe("ERC721 Standard", function () {
    const ipfsHash = "QmTestHash123456789";
    const tribe = "Yoruba";
    const language = "en";

    it("Should support ERC721 interface", async function () {
      const ERC721InterfaceId = "0x80ac58cd";
      expect(await afriverseTales.supportsInterface(ERC721InterfaceId)).to.be.true;
    });

    it("Should support ERC2981 interface", async function () {
      const ERC2981InterfaceId = "0x2a55205a";
      expect(await afriverseTales.supportsInterface(ERC2981InterfaceId)).to.be.true;
    });

    it("Should transfer tokens correctly", async function () {
      await afriverseTales.mintStory(addr1.address, ipfsHash, tribe, language);
      await afriverseTales.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
      expect(await afriverseTales.ownerOf(0)).to.equal(addr2.address);
    });

    it("Should approve and transfer tokens", async function () {
      await afriverseTales.mintStory(addr1.address, ipfsHash, tribe, language);
      await afriverseTales.connect(addr1).approve(addr2.address, 0);
      await afriverseTales.connect(addr2).transferFrom(addr1.address, addr2.address, 0);
      expect(await afriverseTales.ownerOf(0)).to.equal(addr2.address);
    });
  });

  describe("Royalty Information", function () {
    it("Should return correct royalty info", async function () {
      const [recipient, fee] = await afriverseTales.getRoyalties();
      expect(recipient).to.equal(royaltyRecipient.address);
      expect(fee).to.equal(royaltyFeeBps);
    });

    it("Should return royalty info for a token", async function () {
      await afriverseTales.mintStory(
        addr1.address,
        "QmTestHash",
        "Yoruba",
        "en"
      );

      const [recipient, amount] = await afriverseTales.royaltyInfo(0, 10000); // 100% of sale
      expect(recipient).to.equal(royaltyRecipient.address);
      expect(amount).to.equal(500); // 5% of 10000
    });
  });
});

