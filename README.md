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
- Creating token accounts
- Minting tokens to token accounts
- Transferring tokens
- Freezing token accounts
- Thawing token accounts
- Burning tokens
- Closing accounts
- Setting account owners
- Setting acount close authorities

### Requesting Airdrops
- Requesting airdrops

## FAQ

What secret types are supported in the manual input secret field?

- Seed phrase
- Ed25519 comma-separated number array
- Base58 encoded Ed25519 comma-separated number array

How are seed phrases converted to private keys?

- Seed phrases are converted using the derivation path `m/501'/0'/0/0`

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md)
