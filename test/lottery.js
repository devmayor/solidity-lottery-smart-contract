const lottery = artifacts.require("lottery");
const { enterPlayerInLottery } = require("../util");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */


let lotteryInstance;
beforeEach(async ()=>{
  lotteryInstance = await lottery.deployed();
 })
contract("lottery", function (accounts) {

  it("deploys a contract", async () => {
    assert.ok(lotteryInstance.address);
  });

  it("allows one account to enter", async () => {
    await enterPlayerInLottery(lotteryInstance, accounts[1], web3, "0.02");
    const players = await lotteryInstance.getPlayers.call({
      from: accounts[0]
    });
  
    assert.strictEqual(players[0], accounts[1]);
    assert.strictEqual(players.length, 1);
  });

  it("allows multiple accounts to enter", async () => {
    // you could use a new contract contract("lottery", function (accounts) { to use another instance of the same contract
    lotteryInstance = await lottery.new();
    await enterPlayerInLottery(lotteryInstance, accounts[1], web3, "0.02");
    await enterPlayerInLottery(lotteryInstance, accounts[2], web3, "0.02");
    await enterPlayerInLottery(lotteryInstance, accounts[3], web3, "0.02");

    const players = await lotteryInstance.getPlayers.call({
      from: accounts[0]
    });

    assert.strictEqual(players[0], accounts[1]);
    assert.strictEqual(players[1], accounts[2]);
    assert.strictEqual(players[2], accounts[3]);
    assert.strictEqual(players.length, 3);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await enterPlayerInLottery(lotteryInstance, accounts[4], web3, 0);
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("only manager can call pickWinner", async () => {
    try {
      await lotteryInstance.pickWinner({
        from: accounts[1]
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });
  it("sends money to the winner and resets the players array", async () => {
    await enterPlayerInLottery(lotteryInstance, accounts[1], web3, "2");

    const initialBalance = await web3.eth.getBalance(accounts[1]);
    await lotteryInstance.pickWinner({
      from: accounts[0]
    });
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const difference = finalBalance - initialBalance;

    assert(difference > web3.utils.toWei("1.8", "ether"));
  });
});
