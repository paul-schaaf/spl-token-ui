<h1 align="center">spl-token-ui</h1>

<div align="center">

[![Netlify Status](https://api.netlify.com/api/v1/badges/fb20761b-1abb-491e-a299-9a34c2319f85/deploy-status)](https://app.netlify.com/sites/spl-token-ui/deploys)

</div>

<div align="center"><strong>A UI for the creation and management of SPL tokens</strong></div>

## Features
### Managing Tokens
- Creating new tokens
- Editing a token's mint and freeze authority
### Managing Token Accounts
- Creating token accounts and associated token accounts
- Minting tokens to token accounts
- Transferring tokens
- Freezing token accounts
- Thawing token accounts
- Burning tokens
- Closing accounts
- Setting account owners
- Setting acount close authorities

### Airdrops
- Requesting SOL airdrops
- Managing Token Faucets

## FAQ

What secret types are supported in the manual input secret field?

- Seed phrase
- Ed25519 comma-separated number array
- Base58 encoded Ed25519 comma-separated number array

How are seed phrases converted to private keys?

- Seed phrases are converted using the derivation path `m/501'/0'/0/0`

## How-to

### Token Faucets

Token faucets allow developers to easily give others access to tokens of a specific mint without sending around their private key. This is accomplished through a token faucet program (https://github.com/paul-schaaf/spl-token-faucet).

When creating a token faucet, the chosen token's mint authority is transferred to a Program Derived Address. The program then accepts minting requests. Having received such a request, the program checks that the requested amount is lower than the configured max amount or that the requester is the faucet admin (in which case they may mint as much as they like). These parameters can be set during faucet creation. Finally, a faucet may be closed again but only if it has an admin configured which must sign the closure tx. Faucet closure will transfer the token's mint authority back to the admin.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md)
