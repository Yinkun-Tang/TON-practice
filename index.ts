import {Address, TonClient} from "ton"
import {getHttpEndpoint} from "@orbs-network/ton-access";
// run: npm install @orbs-network/ton-access

import {BN} from 'bn.js';
// big number friendly library

import {unixNow} from "./src/lib/utils";
import {MineMessageParams, Queries} from "./src/giver/NftGiver.data";

import {toNano} from "ton";

async function main () {

  const wallet = Address.parse('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
  // Testnet Tonkeeper wallet address
  const collection = Address.parse('EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX');
  // Getgems collection address

  // get the decentralized RPC endpoint in Testnet
  const endpoint = await getHttpEndpoint({
    network: "testnet",
  });
  
  // initialize ton library & connect to an API provider
  const client = new TonClient({ endpoint });
  const miningData = await client.callGetMethod(collection, 'get_mining_data');

  console.log(miningData); // This line could be deleted when entering the next phase
  // test: ts-node index.ts
  // alternative test: npm run start
  /* 
  Sample Output:
  {
  gas_used: 2374,
  stack: [
    [
      'num',
      '0x2880000000000000000000000000000000000000000000000000000000000'
    ],
    [ 'num', '0x63984815' ],
    [ 'num', '0x357401cf9b4f2386950faefd6b616264' ],
    [ 'num', '0x1e' ],
    [ 'num', '0xab' ],
    [ 'num', '0xfc' ]
  ]
  }
  */

  // --------------------------------------------------- End of Phase -----------------------------------------------------------------

  const parseStackNum = (sn: any) => new BN(sn[1].substring(2), 'hex');

  // big number instance
  const complexity = parseStackNum(miningData.stack[0]);
  const last_success = parseStackNum(miningData.stack[1]);
  const seed = parseStackNum(miningData.stack[2]);
  const target_delta = parseStackNum(miningData.stack[3]);
  const min_cpl = parseStackNum(miningData.stack[4]);
  const max_cpl = parseStackNum(miningData.stack[5]);

  console.log('complexity', complexity);
  console.log('last_success', last_success.toString());
  console.log('seed', seed);
  console.log('target_delta', target_delta.toString());
  console.log('min_cpl', min_cpl.toString());
  console.log('max_cpl', max_cpl.toString());
  // test: npm run start

  // ---------------------------------------------------- End of Phase -----------------------------------------------------------------

  const mineParams : MineMessageParams = {
    expire: unixNow() + 300, // 5 min is enough to make a transaction
    mintTo: wallet, // your wallet address
    data1: new BN(0), // temporary variable to increment in the miner
    seed // unique seed from get_mining_data
  };

  let msg = Queries.mine(mineParams); // transaction builder

  /* 
  Original Code:
    while (new BN(msg.hash(), 'be').gt(complexity)) {
    mineParams.expire = unixNow() + 300
    mineParams.data1.iaddn(1)
    msg = Queries.mine(mineParams)
  }

  console.log('Yoo-hoo, you found something!')
  */

  // Optimized Code
  let progress = 0;

  // when the hash value of the message is less than the complexity, the message would be found
  while (new BN(msg.hash(), 'be').gt(complexity)) {
    progress += 1
    console.clear()
    console.log(`Mining started: please, wait for 30-60 seconds to mine your NFT!`)
    console.log(' ')
    console.log(`⛏ Mined ${progress} hashes! Last: `, new BN(msg.hash(), 'be').toString())

    mineParams.expire = unixNow() + 300 // current time + 5 minutes
    mineParams.data1.iaddn(1)
    msg = Queries.mine(mineParams) // compose message
  }

  console.log(' ');
  console.log('💎 Mission completed: msg_hash less than pow_complexity found!');
  console.log(' ');
  console.log('msg_hash: ', new BN(msg.hash(), 'be').toString());
  console.log('pow_complexity: ', complexity.toString());
  console.log('msg_hash < pow_complexity: ', new BN(msg.hash(), 'be').lt(complexity));

  console.log(' ');
  console.log("💣 WARNING! As soon as you find the hash, you should quickly send the transaction.");
  console.log("If someone else sends a transaction before you, the seed changes, and you'll have to find the hash again!");
  console.log(' ');
  // test: npm run start

  // -------------------------------------------------- End of Phase ------------------------------------------------------------------

  // assumed we find the hash of message from the previous phase
  // the NFT should be received when the hash is sent, and the seed would change inside the smart contract
  // old seed would not be recognized on the remote end

  // flags work only in user-friendly address form
  const collectionAddr = collection.toFriendly({
    urlSafe: true,
    bounceable: true,
  })
  // we must convert TON to nanoTON
  const amountToSend = toNano('0.05').toString()
 // BOC means Bag Of Cells here
  const preparedBodyCell = msg.toBoc().toString('base64url')

  // final method to build a payment URL
  const tonDeepLink = (address: string, amount: string, body: string) => {
    return `ton://transfer/${address}?amount=${amount}&bin=${body}`;
  };

  const link = tonDeepLink(collectionAddr, amountToSend, preparedBodyCell);

  console.log('🚀 Link to receive an NFT:')
  console.log(link);
  // test: yarn start

  // ----------------------------------------------------- End of Phase ---------------------------------------------------------------

  const qrcode = require('qrcode-terminal');

  qrcode.generate(link, {small: true}, function (qrcode : any) {
    console.log('🚀 Link to mine your NFT (use Tonkeeper in testnet mode):')
    console.log(qrcode);
    console.log('* If QR is still too big, please run script from the terminal. (or make the font smaller)')
  });
  // test: yarn start

  /* 
  transaction signed on the device would be sent to the testnet backend of the Tonkeeper;
  Tonkeeper validator would recognized the transaction without knowing the seed phrase;
  Eventually the transaction would be pushed to the blockchain. 
  */
}

main()