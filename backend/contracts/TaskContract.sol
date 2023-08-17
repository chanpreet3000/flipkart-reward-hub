// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskContract {
    mapping (address => string)walletIdToCid;

    function getCid(address _address) external view returns (string memory){
        return walletIdToCid[_address];
    }

    function setCid(address _address , string memory _cid) external {
        walletIdToCid[_address] = _cid;
    }

    function setCustomerRetailer(address _retailer , address _customer , string memory retailerCid , string memory 
    customerCid) external {
        walletIdToCid[_retailer] = retailerCid;
        walletIdToCid[_customer] = customerCid;
    }
}