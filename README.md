This module helps to initialize an ethers provider based on environment variables.

## Install

```
npm i ethers-provider-init --save
```

## Usage

Depending of the environment variables the provider might use:

- the default provider `ethers.provider.getDefaultProvider()` if no provider is configured
- one of the currently available providers
- the [fallback provider](https://docs.ethers.io/v5/api/providers/other/#FallbackProvider) if more than one provider is configured.

```js
const { getProvider } = require("ethers-provider-init");

const provider = getProvider();

// alternatively you can pass an object with the environment variables:
// const provider = getProvider({ CLOUDFLARE_ENABLED: "1" });
```

## Environment variables

- `ETHEREUM_NETWORK`: Name of the ethereum network, default to `mainnet`.
- `FALLBACK_QUORUM`: The quorum the backend responses must agree upon before a result will be resolved **when using more than one provider**. By default this is half the sum of the weights.
- `ETHERSCAN_API_KEY`: The api key for etherscan provider.
- `INFURA_PROJECT_ID`: The project id for the infura provider
- `INFURA_PROJECT_SECRET`: The project secret for the infura provider
- `ALCHEMY_API_KEY`: The api key for alchemy provider.
- `CLOUDFLARE_ENABLED`: Set any string other than `"false"` to enable the cloudflare provider which doesn't require any api key.
- `POCKET_APPLICATION_ID`: The application id for the pocket provider.
- `POCKET_APPLICATION_SECRET_KEY`: The application secret for the pocket provider.
- `ANKR_API_KEY`: The api key for alchemy provider.
- `JSON_RPC_URL`: The api key for alchemy provider.

## License

MIT 2022 - José Romaniello
