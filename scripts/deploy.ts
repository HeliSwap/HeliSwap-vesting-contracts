// @ts-nocheck
import hardhat from 'hardhat';

async function deploy (tokenAddress: string, vestingPercentage: string, lockTime: number) {
    console.log('⚙️ Deploying ClaimDrop contract ...');

    const ClaimDropFactory = await hardhat.hethers.getContractFactory("ClaimDrop");
    const claimDrop = await (await ClaimDropFactory.deploy(
        tokenAddress,
        vestingPercentage,
        lockTime
    )).deployed();

    console.log('✅ ClaimDrop contract deployed to:', claimDrop.address);
}

module.exports = deploy;
