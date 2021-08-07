// Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

//     _____ ____  ___   ____________            
//    / ___// __ \/   | / ____/ ____/            
//    \__ \/ /_/ / /| |/ /   / __/               
//   ___/ / ____/ ___ / /___/ /___               
//  /____/_/  _/_/  |_\____/_____/________  _____
//     / __ \/ __ \/ ____/ ____/ ____/ __ \/ ___/
//    / /_/ / / / / / __/ / __/ __/ / /_/ /\__ \ 
//   / ____/ /_/ / /_/ / /_/ / /___/ _, _/___/ / 
//  /_/    \____/\____/\____/_____/_/ |_|/____/  
//
                                             
contract SpacePoggers is ERC721, ERC721Enumerable, Ownable {
  using SafeMath for uint256;
  using Strings for uint256;

  bool public isSaleActive = false;
  uint256 public offsetIndex = 0;
  uint256 public offsetIndexBlock = 0;
  uint256 public revealTimeStamp = block.timestamp + (86400 * 7);

  // Constants
  uint256 public constant TIER1_PRICE = .070 ether;
  uint256 public constant TIER2_PRICE = .065 ether;
  uint256 public constant TIER3_PRICE = .050 ether;
  uint256 public constant TIER1_NUM_TOKENS = 1;
  uint256 public constant TIER2_NUM_TOKENS = 5;
  uint256 public constant TIER3_NUM_TOKENS = 50;
  uint256 public constant MAX_SUPPLY = 12000;
  string public POGGERS_PROVENANCE = ''; // Set once right before launch, when tokens have been finalized

  string private _baseURIExtended;

  constructor() ERC721('SpacePoggers', 'SP') {}

  function startSale() public onlyOwner {
    isSaleActive = true;
  }

  function pauseSale() public onlyOwner {
    isSaleActive = false;
  }

  function withdraw() public onlyOwner {
    uint256 balance = address(this).balance;
    payable(msg.sender).transfer(balance);
  }

  function getTotalSupply() public view returns (uint256) {
    return totalSupply();
  }

  function getPoggersByOwner(address _owner) public view returns (uint256[] memory) {
    uint256 tokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](tokenCount);
    for (uint256 i; i < tokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }

    return tokenIds;
  }

  function mintPoggerTier1() public payable {
    require(isSaleActive, 'Sale must be active to mint Poggers');
    require(totalSupply().add(TIER1_NUM_TOKENS) <= MAX_SUPPLY, 'Sale would exceed max supply');
    require(TIER1_PRICE <= msg.value, 'Not enough ether sent');
    _mintPoggers(TIER1_NUM_TOKENS, msg.sender);
  }

  function mintPoggerTier2() public payable {
    require(isSaleActive, 'Sale must be active to mint Poggers');
    require(totalSupply().add(TIER2_NUM_TOKENS) <= MAX_SUPPLY, 'Sale would exceed max supply');
    require(TIER2_PRICE.mul(TIER2_NUM_TOKENS) <= msg.value, 'Not enough ether sent');
    _mintPoggers(TIER2_NUM_TOKENS, msg.sender);
  }

  function mintPoggerTier3() public payable {
    require(isSaleActive, 'Sale must be active to mint Poggers');
    require(totalSupply().add(TIER3_NUM_TOKENS) <= MAX_SUPPLY, 'Sale would exceed max supply');
    require(TIER3_PRICE.mul(TIER3_NUM_TOKENS) <= msg.value, 'Not enough ether sent');
    _mintPoggers(TIER3_NUM_TOKENS, msg.sender);
  }

  function reservePoggers(uint256 numPoggers) public onlyOwner {
    require(totalSupply().add(TIER3_NUM_TOKENS) <= MAX_SUPPLY, 'Sale would exceed max supply');
    _mintPoggers(numPoggers, msg.sender);
  }

  function giveAwayPogger(uint256 numPoggers, address recipient) external onlyOwner {
    require(totalSupply().add(TIER3_NUM_TOKENS) <= MAX_SUPPLY, 'Sale would exceed max supply');
    _mintPoggers(numPoggers, recipient);
  }

  function _mintPoggers(uint256 numPoggers, address recipient) internal {
    uint256 supply = totalSupply();
    for (uint256 i = 0; i < numPoggers; i++) {
      _safeMint(recipient, supply + i);
    }

    if (
      offsetIndexBlock == 0 && (totalSupply() == MAX_SUPPLY || block.timestamp >= revealTimeStamp)
    ) {
      offsetIndexBlock = block.number;
    }
  }

  function setOffsetIndex() public {
    require(offsetIndex == 0, 'Starting index has already been set');
    require(offsetIndexBlock != 0, 'Starting index block must be set');

    if (block.number.sub(offsetIndexBlock) > 255) {
      offsetIndex = uint256(blockhash(block.number - 1)).mod(MAX_SUPPLY);
    } else {
      offsetIndex = uint256(blockhash(offsetIndexBlock)).mod(MAX_SUPPLY);
    }
  }

  function emergencySetOffsetIndexBlock() public onlyOwner {
    require(offsetIndex == 0, 'Starting index is already set');
    offsetIndexBlock = block.number;
  }

  function setProvenanceHash(string memory provenanceHash) external onlyOwner {
    POGGERS_PROVENANCE = provenanceHash;
  }

  function setRevealTimestamp(uint256 newRevealTimeStamp) external onlyOwner {
    revealTimeStamp = newRevealTimeStamp;
  }

  function setBaseURI(string memory baseURI_) external onlyOwner {
    _baseURIExtended = baseURI_;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURIExtended;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), 'ERC721Metadata: URI query for nonexistent token');
    string memory base = _baseURI();
    uint256 offsetId = tokenId.add(MAX_SUPPLY.sub(offsetIndex)).mod(MAX_SUPPLY);
    return string(abi.encodePacked(base, offsetId.toString()));
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
