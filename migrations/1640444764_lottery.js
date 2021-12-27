const lottery = artifacts.require("lottery");
module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(lottery);
};
