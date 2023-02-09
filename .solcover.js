module.exports = {
    skipFiles: ['tests', 'interfaces', 'libs/TransferHelper.sol', 'mock/MockERC20.sol', 'Timelock.sol'],
    istanbulReporter: ['lcov', 'json', 'text', 'html']
};
