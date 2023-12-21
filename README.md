## TON-Blockchain Solution &amp; Explanation

### Wallet, Repository, and Developer Environment

Wallet: Tonkeeper (Testnet Mode) https://tonkeeper.com/

Repository: https://github.com/ton-community/ton-onboarding-challenge

Developer Environment: Git, NodeJS, Javascript IDE, Yarn

### Connect to TON

Collection Address: EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX

Getgems URL: https://testnet.getgems.io/collection/EQDk8N7xM5D669LC2YACrseBJtDyFqwtSPCNhRWXU7kjEptX

### Q &amp; A

Q1: How could we switch to Tonkeeper's Testnet mode?

A1: In the Settings of the app, tap 5 times on the Tonkeeper icon to enter the developer menu to switch the mode.

Q2: How to get some test coins?

A2: Testnet Faucet: https://t.me/testgiver_ton_bot

Q3: How to check the transaction status outside the Tonkeeper app?

A3: Website Record: https://testnet.tonscan.org/

Q4: How does the message get composed?

A4: [MineMessageParams] indicates what meesage is expected to be read from the smart contract, and [Queries] indicates all possible queries the smart contract could understand. So the [Queries.mine] receives the parameters to return a cell, which is a TON data structure storing memory. The cell packs the necessary data inside itself and sends to the smart contract.
