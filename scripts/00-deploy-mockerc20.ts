import hardhat from 'hardhat';

async function factoryDeployment() {
  const MockERC20 = await hardhat.hethers.getContractFactory('MockERC20');
  const mockERC20 = await MockERC20.deploy();
  const address = (await mockERC20.deployTransaction.wait()).contractAddress
  console.log("MockERC20 address: ", address);
}

module.exports = factoryDeployment;