async function enterPlayerInLottery(
    lotteryContract,
    playerAddress,
    web3Instance,
    etherAmount
  ) {
    //   we dont use .call since we are not getting data. this is a call that updates the blockchain
    await lotteryContract.enter({
      from: playerAddress,
      value: etherAmount ? web3Instance.utils.toWei(etherAmount, "ether") : 0
    });
  }
  
  module.exports = {
    enterPlayerInLottery
  };