const ethers = require('ethers');

const isEnvTrue = (str) => {
  return typeof str === 'string' && str !== '' && str.toLowerCase() !== 'false';
};

const parseConfigInt = (str, def) => {
  if (typeof str !== 'string' || isNaN(str)) { return def; }
  return parseInt(str, 10);
}

module.exports.getProvider = (env) => {
  if (typeof env === 'undefined') { env = process.env; }

  console.dir(env);
  let network = env.ETHEREUM_NETWORK || 'mainnet';
  if (!isNaN(network)) {
    //its a chain id
    network = parseInt(network);
  }
  const providers = [];

  if (env.ETHERSCAN_API_KEY) {
    providers.push(new ethers.providers.EtherscanProvider(network, env.ETHERSCAN_API_KEY));
  }

  if (env.INFURA_PROJECT_ID) {
    providers.push(new ethers.providers.InfuraProvider(network, {
      projectId: env.INFURA_PROJECT_ID,
      projectSecret: env.INFURA_PROJECT_SECRET
    }));
  } else if (!env.INFURA_PROJECT_ID && env.INFURA_PROJECT_SECRET) {
    throw new Error('missing INFURA_PROJECT_ID secret');
  }

  if (env.ALCHEMY_API_KEY) {
    providers.push(new ethers.providers.AlchemyProvider(network, env.ALCHEMY_API_KEY));
  }

  if (isEnvTrue(env.CLOUDFLARE_ENABLED)) {
    providers.push(new ethers.providers.CloudflareProvider(network));
  }

  if (Object.keys(env).some(s => s.startsWith('POCKET_'))) {
    const requiredPocketVariables = ['POCKET_APPLICATION_ID', 'POCKET_APPLICATION_SECRET_KEY'];
    requiredPocketVariables.forEach(rv => {
      if (typeof env[rv] === 'undefined') {
        throw new Error(`missing ${rv} secret`);
      }
    });

    providers.push(new ethers.providers.PocketProvider(network, {
      applicationId: env.POCKET_APPLICATION_ID,
      applicationSecretKey: env.POCKET_APPLICATION_SECRET_KEY,
    }));
  }

  if (env.ANKR_API_KEY) {
    providers.push(new ethers.providers.AnkrProvider(network, env.ANKR_API_KEY));
  }


  if (env.JSON_RPC_URL) {
    providers.push(new ethers.providers.JsonRpcProvider(env.JSON_RPC_URL, network));
  }

  if (providers.length === 1) {
    return providers[0];
  } else if (providers.length === 0) {
    return ethers.providers.getDefaultProvider(network);
  } else {
    const quorum = parseConfigInt(env.FALLBACK_QUORUM);
    if (typeof quorum === 'number') {
      return ethers.providers.FallbackProvider(providers, quorum);
    }
    return ethers.providers.FallbackProvider(providers);
  }
};
