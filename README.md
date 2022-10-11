# Welcome to Bean Machine NFT 💎

[ℹ️ Website](https://thestripesnft.com/)

# The Bean Machine minting dapp 🔥

This repo provides a nice and easy way for linking an existing NFT smart contract to this minting dapp. There are two ways of using this repo, you can go the simple route or the more complex one.

The simple route is so simple, all you need to do is download the build folder on the release page and change the configuration to fit your needs. (Follow the video for a walk through).

The more complex route allows you to add additional functionality if you are comfortable with coding in react.js. (Follow the below instructions for a walk through).

## Usage ℹ️

In order to make use of this dapp, all you need to do is change the configurations to point to your smart contract as well as update the images and theme file.

For the most part all the changes will be in the `public` folder.

To link up your existing smart contract, go to the `public/config/config.json` file and update the following fields to fit your smart contract, network and marketplace details. The cost field should be in wei.

Note: this dapp is designed to work with the intended Bean NFT smart contract, that only takes one parameter in the mint function "mintAmount". But you can change that in the App.js file if you need to use a smart contract that takes 2 params.

```json
{
  "CONTRACT_ADDRESS": "0x827acb09a2dc20e39c9aad7f7190d9bc53534192",
  "SCAN_LINK": "https://polygonscan.com/token/0x827acb09a2dc20e39c9aad7f7190d9bc53534192",
  "NETWORK": {
    "NAME": "Polygon",
    "SYMBOL": "Matic",
    "ID": 137
  },
  "NFT_NAME": "The Stripes NFT",
  "SYMBOL": "TSNFT",
  "MAX_SUPPLY": 992,
  "WEI_COST": 75000000000000000,
  "DISPLAY_COST": 0.075,
  "GAS_LIMIT": 285000,
  "MARKETPLACE": "Opeansea",
  "MARKETPLACE_LINK": "https://opensea.io/collection/the-beans-nft",
  "SHOW_BACKGROUND": true
}
```

Make sure you copy the contract ABI from remix and paste it in the `public/config/abi.json` file.

Remember to update the title and description the `public/index.html` file

```html
<title>Bean Machine NFT</title>
<meta name="description" content="Mint your Bean NFT" />
```

Also remember to update the short_name and name fields in the `public/manifest.json` file

```json
{
  "short_name": "TBNFT",
  "name": "The Bean NFT"
}
```

After all the changes you can run.

```sh
npm run start
```

Or create the build if you are ready to deploy.

```sh
npm run build
```

Now you can host the contents of the build folder on a server.

That's it! you're done.
