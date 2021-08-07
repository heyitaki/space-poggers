async function main() {
  // Grab the contract factory
  const SpacePoggers = await ethers.getContractFactory('SpacePoggers');

  // Start deployment, returning a promise that resolves to a contract object
  const myPogger = await SpacePoggers.deploy(); // Instance of the contract
  console.log('Contract deployed to address:', myPogger.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
