// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AfriverseMarketplace
 * @dev Marketplace contract for buying and selling Afriverse Tales NFTs
 * @notice Supports fixed price listings, auctions, and offers with royalty distribution
 */
contract AfriverseMarketplace is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Platform fee in basis points (250 = 2.5%)
    uint256 public platformFeeBps = 250;
    
    // Maximum royalty fee in basis points (1500 = 15%)
    uint256 public constant MAX_ROYALTY_BPS = 1500;

    // Reference to the NFT contract
    IERC721 public nftContract;

    // Listing counter
    Counters.Counter private _listingIdCounter;

    // Offer counter
    Counters.Counter private _offerIdCounter;

    // Auction counter
    Counters.Counter private _auctionIdCounter;

    // Listing types
    enum ListingType {
        FixedPrice,
        Auction
    }

    // Listing status
    enum ListingStatus {
        Active,
        Sold,
        Cancelled,
        Ended
    }

    // Offer status
    enum OfferStatus {
        Pending,
        Accepted,
        Rejected,
        Expired
    }

    // Listing structure
    struct Listing {
        uint256 listingId;
        uint256 tokenId;
        address seller;
        uint256 price;
        ListingType listingType;
        ListingStatus status;
        uint256 startTime;
        uint256 endTime; // For auctions
        uint256 createdAt;
    }

    // Offer structure
    struct Offer {
        uint256 offerId;
        uint256 tokenId;
        address offerer;
        uint256 price;
        OfferStatus status;
        uint256 expiresAt;
        uint256 createdAt;
    }

    // Auction structure
    struct Auction {
        uint256 auctionId;
        uint256 tokenId;
        address seller;
        uint256 startingPrice;
        uint256 currentBid;
        address currentBidder;
        uint256 endTime;
        bool ended;
    }

    // Mappings
    mapping(uint256 => Listing) public listings; // listingId => Listing
    mapping(uint256 => Listing) public tokenListings; // tokenId => Listing (for active listings)
    mapping(uint256 => Offer[]) public tokenOffers; // tokenId => Offers[]
    mapping(uint256 => Auction) public auctions; // auctionId => Auction
    mapping(uint256 => uint256) public tokenToAuction; // tokenId => auctionId
    mapping(address => uint256[]) public userListings; // user => listingIds[]
    mapping(address => uint256[]) public userOffers; // user => offerIds[]

    // Events
    event ListingCreated(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price,
        ListingType listingType
    );

    event ListingCancelled(uint256 indexed listingId, uint256 indexed tokenId);

    event NFTPurchased(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 price,
        uint256 platformFee,
        uint256 royaltyFee
    );

    event OfferCreated(
        uint256 indexed offerId,
        uint256 indexed tokenId,
        address indexed offerer,
        uint256 price
    );

    event OfferAccepted(
        uint256 indexed offerId,
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 price
    );

    event OfferRejected(uint256 indexed offerId, uint256 indexed tokenId);

    event AuctionCreated(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 startingPrice,
        uint256 endTime
    );

    event BidPlaced(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed bidder,
        uint256 bidAmount
    );

    event AuctionEnded(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed winner,
        uint256 finalPrice
    );

    event PlatformFeeUpdated(uint256 newFeeBps);

    /**
     * @param _nftContract Address of the AfriverseTales NFT contract
     * @param _platformFeeBps Platform fee in basis points (default: 250 = 2.5%)
     */
    constructor(address _nftContract, uint256 _platformFeeBps) Ownable(msg.sender) {
        require(_nftContract != address(0), "Invalid NFT contract address");
        require(_platformFeeBps <= 1000, "Platform fee cannot exceed 10%");
        
        nftContract = IERC721(_nftContract);
        platformFeeBps = _platformFeeBps;
    }

    /**
     * @dev Create a fixed price listing
     * @param tokenId The token ID to list
     * @param price The price in wei
     */
    function createListing(uint256 tokenId, uint256 price) external nonReentrant {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");
        require(tokenListings[tokenId].status != ListingStatus.Active, "Already listed");

        // Transfer NFT to marketplace (marketplace holds during listing)
        nftContract.transferFrom(msg.sender, address(this), tokenId);

        uint256 listingId = _listingIdCounter.current();
        _listingIdCounter.increment();

        Listing memory newListing = Listing({
            listingId: listingId,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            listingType: ListingType.FixedPrice,
            status: ListingStatus.Active,
            startTime: block.timestamp,
            endTime: 0,
            createdAt: block.timestamp
        });

        listings[listingId] = newListing;
        tokenListings[tokenId] = newListing;
        userListings[msg.sender].push(listingId);

        emit ListingCreated(listingId, tokenId, msg.sender, price, ListingType.FixedPrice);
    }

    /**
     * @dev Create an auction listing
     * @param tokenId The token ID to auction
     * @param startingPrice The starting bid price in wei
     * @param duration The auction duration in seconds
     */
    function createAuction(
        uint256 tokenId,
        uint256 startingPrice,
        uint256 duration
    ) external nonReentrant {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(startingPrice > 0, "Starting price must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");
        require(tokenListings[tokenId].status != ListingStatus.Active, "Already listed");

        // Transfer NFT to marketplace
        nftContract.transferFrom(msg.sender, address(this), tokenId);

        uint256 listingId = _listingIdCounter.current();
        _listingIdCounter.increment();

        uint256 auctionId = _auctionIdCounter.current();
        _auctionIdCounter.increment();

        uint256 endTime = block.timestamp + duration;

        Listing memory newListing = Listing({
            listingId: listingId,
            tokenId: tokenId,
            seller: msg.sender,
            price: startingPrice,
            listingType: ListingType.Auction,
            status: ListingStatus.Active,
            startTime: block.timestamp,
            endTime: endTime,
            createdAt: block.timestamp
        });

        Auction memory newAuction = Auction({
            auctionId: auctionId,
            tokenId: tokenId,
            seller: msg.sender,
            startingPrice: startingPrice,
            currentBid: 0,
            currentBidder: address(0),
            endTime: endTime,
            ended: false
        });

        listings[listingId] = newListing;
        tokenListings[tokenId] = newListing;
        auctions[auctionId] = newAuction;
        tokenToAuction[tokenId] = auctionId;
        userListings[msg.sender].push(listingId);

        emit ListingCreated(listingId, tokenId, msg.sender, startingPrice, ListingType.Auction);
        emit AuctionCreated(auctionId, tokenId, msg.sender, startingPrice, endTime);
    }

    /**
     * @dev Purchase a fixed price listing
     * @param listingId The listing ID to purchase
     */
    function purchaseListing(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.status == ListingStatus.Active, "Listing not active");
        require(listing.listingType == ListingType.FixedPrice, "Not a fixed price listing");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy your own listing");

        listing.status = ListingStatus.Sold;

        // Calculate fees
        uint256 platformFee = (listing.price * platformFeeBps) / 10000;
        uint256 royaltyFee = 0;
        uint256 sellerAmount = listing.price - platformFee;

        // Try to get royalty info from NFT contract
        try ERC2981(address(nftContract)).royaltyInfo(listing.tokenId, listing.price) returns (
            address recipient,
            uint256 royaltyAmount
        ) {
            if (recipient != address(0) && royaltyAmount > 0) {
                royaltyFee = royaltyAmount;
                sellerAmount -= royaltyFee;
                // Transfer royalty to creator
                (bool royaltySuccess, ) = payable(recipient).call{value: royaltyFee}("");
                require(royaltySuccess, "Royalty transfer failed");
            }
        } catch {
            // Contract doesn't support royalties, continue without
        }

        // Transfer NFT to buyer
        nftContract.transferFrom(address(this), msg.sender, listing.tokenId);

        // Transfer payment to seller
        (bool sellerSuccess, ) = payable(listing.seller).call{value: sellerAmount}("");
        require(sellerSuccess, "Seller transfer failed");

        // Transfer platform fee to owner
        (bool platformSuccess, ) = payable(owner()).call{value: platformFee}("");
        require(platformSuccess, "Platform fee transfer failed");

        // Refund excess payment
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }

        // Remove from active listings
        delete tokenListings[listing.tokenId];

        emit NFTPurchased(
            listingId,
            listing.tokenId,
            listing.seller,
            msg.sender,
            listing.price,
            platformFee,
            royaltyFee
        );
    }

    /**
     * @dev Place a bid on an auction
     * @param auctionId The auction ID
     */
    function placeBid(uint256 auctionId) external payable nonReentrant {
        Auction storage auction = auctions[auctionId];
        require(!auction.ended, "Auction ended");
        require(block.timestamp < auction.endTime, "Auction expired");
        require(msg.sender != auction.seller, "Cannot bid on your own auction");

        uint256 minBid = auction.currentBid > 0 
            ? auction.currentBid + (auction.currentBid * 5 / 100) // 5% increment
            : auction.startingPrice;

        require(msg.value >= minBid, "Bid too low");

        // Refund previous bidder if exists
        if (auction.currentBidder != address(0) && auction.currentBid > 0) {
            (bool refundSuccess, ) = payable(auction.currentBidder).call{value: auction.currentBid}("");
            require(refundSuccess, "Refund failed");
        }

        auction.currentBid = msg.value;
        auction.currentBidder = msg.sender;

        emit BidPlaced(auctionId, auction.tokenId, msg.sender, msg.value);
    }

    /**
     * @dev End an auction and transfer NFT to winner
     * @param auctionId The auction ID
     */
    function endAuction(uint256 auctionId) external nonReentrant {
        Auction storage auction = auctions[auctionId];
        require(!auction.ended, "Auction already ended");
        require(block.timestamp >= auction.endTime, "Auction not ended yet");

        auction.ended = true;
        Listing storage listing = listings[tokenListings[auction.tokenId].listingId];
        listing.status = ListingStatus.Ended;

        if (auction.currentBidder != address(0)) {
            // Calculate fees
            uint256 platformFee = (auction.currentBid * platformFeeBps) / 10000;
            uint256 royaltyFee = 0;
            uint256 sellerAmount = auction.currentBid - platformFee;

            // Try to get royalty info
            try ERC2981(address(nftContract)).royaltyInfo(auction.tokenId, auction.currentBid) returns (
                address recipient,
                uint256 royaltyAmount
            ) {
                if (recipient != address(0) && royaltyAmount > 0) {
                    royaltyFee = royaltyAmount;
                    sellerAmount -= royaltyFee;
                    (bool royaltySuccess, ) = payable(recipient).call{value: royaltyFee}("");
                    require(royaltySuccess, "Royalty transfer failed");
                }
            } catch {}

            // Transfer NFT to winner
            nftContract.transferFrom(address(this), auction.currentBidder, auction.tokenId);

            // Transfer payment to seller
            (bool sellerSuccess, ) = payable(auction.seller).call{value: sellerAmount}("");
            require(sellerSuccess, "Seller transfer failed");

            // Transfer platform fee
            (bool platformSuccess, ) = payable(owner()).call{value: platformFee}("");
            require(platformSuccess, "Platform fee transfer failed");

            delete tokenListings[auction.tokenId];

            emit AuctionEnded(auctionId, auction.tokenId, auction.currentBidder, auction.currentBid);
        } else {
            // No bids, return NFT to seller
            nftContract.transferFrom(address(this), auction.seller, auction.tokenId);
            delete tokenListings[auction.tokenId];
        }
    }

    /**
     * @dev Cancel a listing
     * @param listingId The listing ID to cancel
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.status == ListingStatus.Active, "Listing not active");

        listing.status = ListingStatus.Cancelled;

        // Return NFT to seller
        nftContract.transferFrom(address(this), listing.seller, listing.tokenId);

        // If it's an auction, handle refunds
        if (listing.listingType == ListingType.Auction) {
            uint256 auctionId = tokenToAuction[listing.tokenId];
            Auction storage auction = auctions[auctionId];
            if (auction.currentBidder != address(0) && auction.currentBid > 0) {
                (bool refundSuccess, ) = payable(auction.currentBidder).call{value: auction.currentBid}("");
                require(refundSuccess, "Refund failed");
            }
            auction.ended = true;
        }

        delete tokenListings[listing.tokenId];

        emit ListingCancelled(listingId, listing.tokenId);
    }

    /**
     * @dev Create an offer for an unlisted NFT
     * @param tokenId The token ID
     * @param duration Offer expiration duration in seconds
     */
    function createOffer(uint256 tokenId, uint256 duration) external payable nonReentrant {
        require(msg.value > 0, "Offer must be greater than 0");
        require(nftContract.ownerOf(tokenId) != msg.sender, "Cannot offer on your own NFT");
        require(tokenListings[tokenId].status != ListingStatus.Active, "NFT is listed");

        uint256 offerId = _offerIdCounter.current();
        _offerIdCounter.increment();

        Offer memory newOffer = Offer({
            offerId: offerId,
            tokenId: tokenId,
            offerer: msg.sender,
            price: msg.value,
            status: OfferStatus.Pending,
            expiresAt: block.timestamp + duration,
            createdAt: block.timestamp
        });

        tokenOffers[tokenId].push(newOffer);
        userOffers[msg.sender].push(offerId);

        emit OfferCreated(offerId, tokenId, msg.sender, msg.value);
    }

    /**
     * @dev Accept an offer
     * @param tokenId The token ID
     * @param offerIndex The index of the offer in the tokenOffers array
     */
    function acceptOffer(uint256 tokenId, uint256 offerIndex) external nonReentrant {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        
        Offer[] storage offers = tokenOffers[tokenId];
        require(offerIndex < offers.length, "Invalid offer index");
        
        Offer storage offer = offers[offerIndex];
        require(offer.status == OfferStatus.Pending, "Offer not pending");
        require(block.timestamp < offer.expiresAt, "Offer expired");

        offer.status = OfferStatus.Accepted;

        // Calculate fees
        uint256 platformFee = (offer.price * platformFeeBps) / 10000;
        uint256 royaltyFee = 0;
        uint256 sellerAmount = offer.price - platformFee;

        // Try to get royalty info
        try ERC2981(address(nftContract)).royaltyInfo(tokenId, offer.price) returns (
            address recipient,
            uint256 royaltyAmount
        ) {
            if (recipient != address(0) && royaltyAmount > 0) {
                royaltyFee = royaltyAmount;
                sellerAmount -= royaltyFee;
                (bool royaltySuccess, ) = payable(recipient).call{value: royaltyFee}("");
                require(royaltySuccess, "Royalty transfer failed");
            }
        } catch {}

        // Transfer NFT to offerer
        nftContract.transferFrom(msg.sender, offer.offerer, tokenId);

        // Transfer payment to seller
        (bool sellerSuccess, ) = payable(msg.sender).call{value: sellerAmount}("");
        require(sellerSuccess, "Seller transfer failed");

        // Transfer platform fee
        (bool platformSuccess, ) = payable(owner()).call{value: platformFee}("");
        require(platformSuccess, "Platform fee transfer failed");

        // Reject other pending offers
        for (uint256 i = 0; i < offers.length; i++) {
            if (i != offerIndex && offers[i].status == OfferStatus.Pending) {
                offers[i].status = OfferStatus.Rejected;
                (bool refundSuccess, ) = payable(offers[i].offerer).call{value: offers[i].price}("");
                require(refundSuccess, "Refund failed");
                emit OfferRejected(offers[i].offerId, tokenId);
            }
        }

        emit OfferAccepted(offer.offerId, tokenId, msg.sender, offer.offerer, offer.price);
    }

    /**
     * @dev Reject an offer and refund the offerer
     * @param tokenId The token ID
     * @param offerIndex The index of the offer
     */
    function rejectOffer(uint256 tokenId, uint256 offerIndex) external nonReentrant {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        
        Offer[] storage offers = tokenOffers[tokenId];
        require(offerIndex < offers.length, "Invalid offer index");
        
        Offer storage offer = offers[offerIndex];
        require(offer.status == OfferStatus.Pending, "Offer not pending");

        offer.status = OfferStatus.Rejected;

        // Refund offerer
        (bool refundSuccess, ) = payable(offer.offerer).call{value: offer.price}("");
        require(refundSuccess, "Refund failed");

        emit OfferRejected(offer.offerId, tokenId);
    }

    /**
     * @dev Get all offers for a token
     * @param tokenId The token ID
     * @return Array of offers
     */
    function getTokenOffers(uint256 tokenId) external view returns (Offer[] memory) {
        return tokenOffers[tokenId];
    }

    /**
     * @dev Get listing by token ID
     * @param tokenId The token ID
     * @return The listing
     */
    function getListingByToken(uint256 tokenId) external view returns (Listing memory) {
        return tokenListings[tokenId];
    }

    /**
     * @dev Get auction by token ID
     * @param tokenId The token ID
     * @return The auction
     */
    function getAuctionByToken(uint256 tokenId) external view returns (Auction memory) {
        uint256 auctionId = tokenToAuction[tokenId];
        return auctions[auctionId];
    }

    /**
     * @dev Update platform fee (owner only)
     * @param newFeeBps New fee in basis points
     */
    function setPlatformFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 1000, "Platform fee cannot exceed 10%");
        platformFeeBps = newFeeBps;
        emit PlatformFeeUpdated(newFeeBps);
    }

    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}

