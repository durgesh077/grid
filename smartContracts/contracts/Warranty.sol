//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Warranty {
    address private owner;
    struct nft {
        uint64 startTimestamp;
        uint64 startAfter;
        string serial_no;
        string cid;
    }

    mapping(uint64 => mapping(string => uint64)) private myNFT;
    uint64[] private erased;
    nft[] nft_collection;
    mapping(string => uint64) private serial_no_owner_mob_no;
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only owner is allowed to perform this operation"
        );
        _;
    }

    event Mint(uint64 indexed to, string indexed serial_no, uint64 tokenNo);
    event Transfer(
        uint64 indexed from,
        uint64 indexed to,
        string indexed serial_no
    );
    event Burned(string indexed serial_no);
    constructor() {
        owner = msg.sender;
        nft memory tempNFt;
        nft_collection.push(tempNFt);
    }

    function mintWarrantyCardNFT(
        uint64 _mobile_no,
        string calldata _serial_no,
        string calldata _cid,
        uint64 _startAfter
    ) external onlyOwner {
        require(_mobile_no != 0, "please provide valid mobile number");
        require(
            serial_no_owner_mob_no[_serial_no] == 0,
            "Serial number is already taken"
        );
        require(_startAfter >= 0, "not valid start time");
        nft memory newNft = nft(
            uint64(block.timestamp),
            _startAfter,
            _serial_no,
            _cid
        );
        uint64 tokenNo;
        if (erased.length == 0) {
            nft_collection.push(newNft);
            tokenNo = uint64(nft_collection.length) - 1;
        } else {
            tokenNo = erased[erased.length - 1];
            erased.pop();
            nft_collection[tokenNo] = newNft;
        }
        myNFT[_mobile_no][_serial_no] = tokenNo;
        serial_no_owner_mob_no[_serial_no] = _mobile_no;
        emit Mint(_mobile_no, _serial_no, tokenNo);
    }

    function burnWarrantyCardNFT(string calldata _serial_no)
        external
        onlyOwner
        returns (bool succeeded)
    {
        uint64 mobile_no = serial_no_owner_mob_no[_serial_no];
        require(mobile_no != 0, "This serial number has no warranty NFT");
        uint64 tokenNo = myNFT[mobile_no][_serial_no];
        nft storage wc = nft_collection[tokenNo];

        require (wc.startTimestamp + wc.startAfter >= block.timestamp,"replacement time over");

        delete myNFT[mobile_no][_serial_no];
        delete serial_no_owner_mob_no[_serial_no];
        delete nft_collection[tokenNo];
        erased.push(tokenNo);
        emit Burned(_serial_no);
        return true;
    }

    function sendOwnership(
        uint64 from,
        uint64 to,
        string calldata _serial_no
    ) external onlyOwner {
        uint64 tokenNo = myNFT[from][_serial_no];
        require(tokenNo != 0, "Please provide correct data");
        delete myNFT[from][_serial_no];
        require(to != 0, "Please provide valid reciever");
        serial_no_owner_mob_no[_serial_no] = to;
        myNFT[to][_serial_no] = tokenNo;
        emit Transfer(from, to, _serial_no);
    }

    function getSerialNoOwnerMobileNo(string calldata _serial_no)
        external
        view
        returns (uint64 mobileNo)
    {
        uint64 Owner=serial_no_owner_mob_no[_serial_no];
        require(Owner!=0,"serial no does not exists");
        return Owner;
    }

    function getNFTFor(uint64 _mobile_no, string calldata _serial_no)
        external
        view
        returns (nft memory NFT)
    {
        uint64 tokenId = myNFT[_mobile_no][_serial_no];
        require(tokenId > 0, "Please provide correct data");
        return nft_collection[tokenId];
    }

}
