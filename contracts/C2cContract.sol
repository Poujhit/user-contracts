// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

/// @title C2C contract
/// @author Poujhit
/// @notice A C2C contract between a buyer and seller
/// @dev Buyer is the one creating this contract and will send the money to the seller. While deploying the contract,
/// buyer will send the price amount in msg.value. Now the contract will hold the amount. Later the seller can withdraw
/// the funds using the withdrawFunds function. Only seller can withdraw the funds.
/// Time is stored as uint64 coz im using unix timestamp.
/// prodName is stored as bytes32 so in frontend convert it to bytes32 string using this https://docs.ethers.io/v5/api/utils/strings/#utils-parseBytes32
/// Decode it using this https://docs.ethers.io/v5/api/utils/strings/#utils-parseBytes32

contract C2cContract {
    address payable private buyer;
    address payable private seller;
    uint256 private price;
    uint64 private startDate;
    uint64 private endDate;
    bytes32 private prodName;

    bool private withdrawed;

    error Unauthorized();
    error Withdrawed();

    constructor(
        address payable sellerAddress,
        uint256 priceOfGoods,
        uint64 date1,
        uint64 date2,
        bytes32 productName
    ) payable {
        seller = sellerAddress;
        // when deploying the contract, owner is the buyer and msg.sender will have the owner address only
        buyer = payable(msg.sender);
        price = priceOfGoods;
        startDate = date1;
        endDate = date2;
        withdrawed = false;
        prodName = productName;
    }

    function getBuyer()
        public
        view
        onlySellerOrBuyer
        returns (address payable)
    {
        return buyer;
    }

    function getSeller() public view onlySellerOrBuyer returns (address) {
        return seller;
    }

    function getPrice() public view onlySellerOrBuyer returns (uint256) {
        return price;
    }

    function getStartDate() public view onlySellerOrBuyer returns (uint64) {
        return startDate;
    }

    function getEndDate() public view onlySellerOrBuyer returns (uint64) {
        return endDate;
    }

    function getProdName() public view onlySellerOrBuyer returns (bytes32) {
        return prodName;
    }

    function isFundsWithdrawed() public view onlySellerOrBuyer returns (bool) {
        return withdrawed;
    }

    function withdrawFunds() public payable notYetWithdrawed onlySeller {
        console.log(msg.sender);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Withdraw failed");
        withdrawed = true;
    }

    modifier onlySellerOrBuyer() {
        if (msg.sender != seller && msg.sender != buyer) revert Unauthorized();
        _;
    }
    modifier onlySeller() {
        if (msg.sender != seller) revert Unauthorized();
        _;
    }
    modifier notYetWithdrawed() {
        if (withdrawed) revert Withdrawed();
        _;
    }
}
