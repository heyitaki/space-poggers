// Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract SpacePoggers is ERC721, ERC721Enumerable, Ownable {
  using SafeMath for uint256;

  bool public isSaleActive = false;

  // Constants
  uint256 public constant TIER1_PRICE = .07 ether;
  uint256 public constant TIER2_PRICE = .06 ether;
  uint256 public constant TIER3_PRICE = .05 ether;
  uint256 public constant TIER1_NUM_TOKENS = 1;
  uint256 public constant TIER2_NUM_TOKENS = 3;
  uint256 public constant TIER3_NUM_TOKENS = 12;
  uint256 public constant MAX_SUPPLY = 12000;

  constructor() ERC721('SpacePoggers', 'SP') {}

  function startSale() public onlyOwner {
    isSaleActive = true;
  }

  function pauseSale() public onlyOwner {
    isSaleActive = false;
  }

  /**
   * Reserve specified number of poggers.
   */
  function reservePoggers(uint256 numPoggers) public onlyOwner {
    for (uint256 i = 0; i < numPoggers; i++) {
      _safeMint(msg.sender, totalSupply().add(i));
    }
  }

  function getUnmintedSupply() public view returns (uint256) {
    return MAX_SUPPLY.sub(totalSupply());
  }

  function mintPoggerTier1() public payable {
    require(totalSupply().add(TIER1_NUM_TOKENS) <= MAX_SUPPLY, 'Sale would exceed max supply');
    require(TIER1_PRICE <= msg.value, 'Not enough ether sent');
    _mintPogger(TIER1_NUM_TOKENS);
  }

  function mintPoggerTier2() public payable {
    require(totalSupply().add(TIER2_NUM_TOKENS) <= MAX_SUPPLY, 'Sale would exceed max supply');
    require(TIER2_PRICE.mul(TIER2_NUM_TOKENS) <= msg.value, 'Not enough ether sent');
    _mintPogger(TIER2_NUM_TOKENS);
  }

  function mintPoggerTier3() public payable {
    require(totalSupply().add(TIER3_NUM_TOKENS) <= MAX_SUPPLY, 'Sale would exceed max supply');
    require(TIER3_PRICE.mul(TIER3_NUM_TOKENS) <= msg.value, 'Not enough ether sent');
    _mintPogger(TIER3_NUM_TOKENS);
  }

  function _mintPogger(uint256 numPoggers) internal {
    require(isSaleActive, 'Sale must be active to mint Poggers');
    for (uint256 i = 0; i < numPoggers; i++) {
      if (totalSupply() < MAX_SUPPLY) {
        _safeMint(msg.sender, totalSupply());
      }
    }
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
