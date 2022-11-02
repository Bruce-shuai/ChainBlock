const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    // 增加一个nonce，这样每次生成的hash都不同，增加了算力复杂度
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }
  // 刻意让一个区块的生成花费比较大的算力，避免现代计算机能很快计算出来。
  mineBlock(difficulty) {
    // 这样就会花费比较大的算力。
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined:" + this.hash)
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  // 创建 创世纪区块
  createGenesisBlock() {
    return new Block(0, "02/11/2022", "Genesis block", "0");
  }

  // 获取最近的区块
  getLatestBlock() {
    return this.chain.at(-1);
  }

  // 添加新的区块
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  // 判断链是否是对的
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      // 检查当前区块是否有变更
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

let bitCoin = new Blockchain();

console.log("Mining block 1...");
bitCoin.addBlock(new Block(1, "02/11/2022", {amount: 4})) 

console.log("Mining block 2...");
bitCoin.addBlock(new Block(2, "02/11/2022", {amount: 10})) 

console.log("Is blockchain valid?", bitCoin.isChainValid());

bitCoin.chain[2].data = {mount: 10}

console.log("Is blockchain valid?", bitCoin.isChainValid());

console.log(JSON.stringify(bitCoin, null, 4))