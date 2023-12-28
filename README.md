## TON-Blockchain Solution &amp; Explanation

Tutorial URL: https://docs.ton.org/develop/get-started-with-ton

TON Hello World: https://ton-community.github.io/tutorials/01-wallet/

### Wallet, Repository, and Developer Environment

Wallet: Tonkeeper (Testnet Mode) https://tonkeeper.com/

Repository: https://github.com/ton-community/ton-onboarding-challenge

Developer Environment: Git, NodeJS, Javascript IDE, Yarn

### Connect to TON

Collection Address: EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX

Getgems URL: https://testnet.getgems.io/collection/EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX

### Numerical Mining Data in a User-Friendly Format

complexity: Indicator of Proof-of-Work complexity. Expect final hash to be less than complexity.

last_success: unix timestamp keeps track of the last mining transaction on TON. When the metric changes, the miner should be run again since the seed also changes during this process.

seed: a unique value generated by a smart contract to calculate the desired hash.


### Q &amp; A

Q1: How could we switch to Tonkeeper's Testnet mode?

A1: In the Settings of the app, tap 5 times on the Tonkeeper icon to enter the developer menu to switch the mode.

Q2: How to get some test coins?

A2: Testnet Faucet: https://t.me/testgiver_ton_bot

Q3: How to check the transaction status outside the Tonkeeper app?

A3: Website Record: https://testnet.tonscan.org/

Q4: How does the message get composed?

A4: [MineMessageParams] indicates what meesage is expected to be read from the smart contract, and [Queries] indicates all possible queries the smart contract could understand. So the [Queries.mine] receives the parameters to return a cell, which is a TON data structure storing memory. The cell packs the necessary data inside itself and sends to the smart contract.

Q5: I would like to sign the transaction directly using private key instead of QR code, is it possible?

A5: Certainly! Please check Step 9 of TON Hello World: https://ton-community.github.io/tutorials/01-wallet/. Here is the code:

```ts
await walletContract.sendTransfer({
  secretKey: key.secretKey, // Replace with private key string in here
  seqno: seqno,
  messages: [
    internal({
      to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
      value: "0.05",
      body: "Hello",
      bounce: false,
    })
  ]
});

```

### How to run the code?

Cloned the github repository of the onboarding challenge to the local environment, install required package, then copy and paste the index.ts file to the local repository folder and replace the wallet address with the personal wallet address on Testnet.

### What does the program do?

Generally, the program retrieves the mining data from the collection, then packs the provided data in cells, then sends the cells as message to the smart contract when user signs the transaction on the device.
