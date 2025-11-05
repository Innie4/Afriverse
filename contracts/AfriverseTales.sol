// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AfriverseTales
 * @dev ERC721 NFT contract for minting African stories with IPFS metadata
 * @notice Supports royalty mechanism via ERC2981 and admin controls via Ownable
 */
contract AfriverseTales is ERC721, ERC721URIStorage, ERC2981, Ownable {
    uint256 private _tokenIdCounter;

    // Mapping from token ID to story metadata
    mapping(uint256 => StoryMetadata) private _storyMetadata;

    // Mapping from token ID to IPFS hash
    mapping(uint256 => string) private _ipfsHashes;

    // Royalty info
    address private _royaltyRecipient;
    uint96 private _royaltyFeeBps; // Basis points (e.g., 500 = 5%)

    // Struct for story metadata
    struct StoryMetadata {
        address author;
        string tribe;
        string language;
        uint256 timestamp;
        string ipfsHash;
    }

    /**
     * @dev Emitted when a new story is minted
     * @param tokenId The unique token ID
     * @param ipfsHash The IPFS hash of the story metadata
     * @param author The address of the story author
     * @param tribe The tribe associated with the story
     * @param timestamp The timestamp when the story was minted
     */
    event StoryMinted(
        uint256 indexed tokenId,
        string ipfsHash,
        address indexed author,
        string tribe,
        uint256 timestamp
    );

    /**
     * @dev Emitted when royalties are updated
     * @param recipient The address that receives royalties
     * @param feeBps The royalty fee in basis points
     */
    event RoyaltiesUpdated(address indexed recipient, uint96 feeBps);

    /**
     * @param name The name of the NFT collection
     * @param symbol The symbol of the NFT collection
     * @param royaltyRecipient The address that receives royalties
     * @param royaltyFeeBps The royalty fee in basis points (e.g., 500 = 5%)
     */
    constructor(
        string memory name,
        string memory symbol,
        address royaltyRecipient,
        uint96 royaltyFeeBps
    ) ERC721(name, symbol) Ownable(msg.sender) {
        require(royaltyRecipient != address(0), "Invalid royalty recipient");
        require(royaltyFeeBps <= 10000, "Royalty fee exceeds 100%");

        _royaltyRecipient = royaltyRecipient;
        _royaltyFeeBps = royaltyFeeBps;

        // Set default royalty for all tokens
        _setDefaultRoyalty(royaltyRecipient, royaltyFeeBps);
    }

    /**
     * @dev Mint a new story NFT
     * @param to The address to mint the NFT to
     * @param ipfsHash The IPFS hash of the story metadata
     * @param tribe The tribe associated with the story
     * @param language The language of the story
     * @return tokenId The ID of the newly minted token
     */
    function mintStory(
        address to,
        string memory ipfsHash,
        string memory tribe,
        string memory language
    ) public returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        // Mint the NFT
        _safeMint(to, tokenId);

        // Construct IPFS URI (assuming format: ipfs://<hash>)
        string memory ipfsURI = string(abi.encodePacked("ipfs://", ipfsHash));

        // Set token URI
        _setTokenURI(tokenId, ipfsURI);

        // Store metadata
        _storyMetadata[tokenId] = StoryMetadata({
            author: to,
            tribe: tribe,
            language: language,
            timestamp: block.timestamp,
            ipfsHash: ipfsHash
        });

        _ipfsHashes[tokenId] = ipfsHash;

        // Emit event
        emit StoryMinted(tokenId, ipfsHash, to, tribe, block.timestamp);

        return tokenId;
    }

    /**
     * @dev Mint a story with full metadata (admin only)
     * @param to The address to mint the NFT to
     * @param ipfsHash The IPFS hash
     * @param tribe The tribe
     * @param language The language
     * @param author The author address (can be different from to)
     * @return tokenId The ID of the newly minted token
     */
    function mintStoryWithAuthor(
        address to,
        string memory ipfsHash,
        string memory tribe,
        string memory language,
        address author
    ) public onlyOwner returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(author != address(0), "Invalid author address");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);

        string memory ipfsURI = string(abi.encodePacked("ipfs://", ipfsHash));
        _setTokenURI(tokenId, ipfsURI);

        _storyMetadata[tokenId] = StoryMetadata({
            author: author,
            tribe: tribe,
            language: language,
            timestamp: block.timestamp,
            ipfsHash: ipfsHash
        });

        _ipfsHashes[tokenId] = ipfsHash;

        emit StoryMinted(tokenId, ipfsHash, author, tribe, block.timestamp);

        return tokenId;
    }

    /**
     * @dev Get story metadata for a token
     * @param tokenId The token ID
     * @return metadata The story metadata struct
     */
    function getStoryMetadata(uint256 tokenId) public view returns (StoryMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _storyMetadata[tokenId];
    }

    /**
     * @dev Get IPFS hash for a token
     * @param tokenId The token ID
     * @return ipfsHash The IPFS hash
     */
    function getIPFSHash(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _ipfsHashes[tokenId];
    }

    /**
     * @dev Get the total number of minted tokens
     * @return The total supply
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Update royalty information (admin only)
     * @param recipient The address that receives royalties
     * @param feeBps The royalty fee in basis points
     */
    function setRoyalties(address recipient, uint96 feeBps) public onlyOwner {
        require(recipient != address(0), "Invalid royalty recipient");
        require(feeBps <= 10000, "Royalty fee exceeds 100%");

        _royaltyRecipient = recipient;
        _royaltyFeeBps = feeBps;
        _setDefaultRoyalty(recipient, feeBps);

        emit RoyaltiesUpdated(recipient, feeBps);
    }

    /**
     * @dev Get current royalty information
     * @return recipient The royalty recipient address
     * @return feeBps The royalty fee in basis points
     */
    function getRoyalties() public view returns (address recipient, uint96 feeBps) {
        return (_royaltyRecipient, _royaltyFeeBps);
    }

    /**
     * @dev Override supportsInterface to include ERC2981
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, ERC721URIStorage, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Override tokenURI to return IPFS metadata URL
     */
    function tokenURI(
        uint256 tokenId
    ) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}

