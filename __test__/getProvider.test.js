const ethers = require('ethers');
const { getProvider } = require('../');
jest.mock('ethers');

describe('providers initialization', () => {

  const infuraProvider = {};
  const etherscanProvider = {};
  const alchemyProvider = {};
  const ankrProvider = {};
  const cloudflareProvider = {};
  const pocketProvider = {};
  const defaultProvider = {};
  const fallbackProvider = {}
  const jsonRPCProvider = {}

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    ethers.providers.InfuraProvider = jest.fn().mockImplementation(() => infuraProvider);
    ethers.providers.EtherscanProvider = jest.fn().mockImplementation(() => etherscanProvider);
    ethers.providers.AlchemyProvider = jest.fn().mockImplementation(() => alchemyProvider);
    ethers.providers.AnkrProvider = jest.fn().mockImplementation(() => ankrProvider);
    ethers.providers.PocketProvider = jest.fn().mockImplementation(() => pocketProvider);
    ethers.providers.CloudflareProvider = jest.fn().mockImplementation(() => cloudflareProvider);
    ethers.providers.FallbackProvider = jest.fn().mockImplementation(() => fallbackProvider);
    ethers.providers.getDefaultProvider = jest.fn().mockImplementation(() => defaultProvider);
    ethers.providers.JsonRpcProvider = jest.fn().mockImplementation(() => jsonRPCProvider);
    expect(ethers.providers.InfuraProvider).not.toHaveBeenCalled();
  });

  describe('when no provider configuration is set', () => {
    it('should use the default provider', () => {
      const provider = getProvider({});

      expect(provider)
        .toBe(defaultProvider);

      expect(ethers.providers.getDefaultProvider)
        .toHaveBeenCalledWith('mainnet');
    });

    it('should use the network passed with default provider', () => {
      const provider = getProvider({ ETHEREUM_NETWORK: 'ropsten' });

      expect(provider)
        .toBe(defaultProvider);

      expect(ethers.providers.getDefaultProvider)
        .toHaveBeenCalledWith('ropsten');
    });
  });

  describe('when setting infura variables', () => {
    const env = {
      INFURA_PROJECT_ID: 'project-id',
      INFURA_PROJECT_SECRET: 'project-secret',
    };

    it('should not use the default provider', () => {
      getProvider(env);
      expect(ethers.providers.getDefaultProvider)
        .not.toHaveBeenCalled();
    });

    it('should use the InfuraProvider', () => {
      const provider = getProvider(env);
      expect(provider).toBe(infuraProvider);
      expect(ethers.providers.InfuraProvider).toHaveBeenCalledWith('mainnet', {
        projectId: env.INFURA_PROJECT_ID,
        projectSecret: env.INFURA_PROJECT_SECRET
      });
    });

    it('should fail when no project_id is provided', () => {
      expect(() => getProvider({ ...env, INFURA_PROJECT_ID: null }))
        .toThrow('missing INFURA_PROJECT_ID secret');
    });
  });

  describe('when enabling cloudflare', () => {
    const env = {
      CLOUDFLARE_ENABLED: '1'
    };

    it('should use the provider', () => {
      const provider = getProvider(env);
      expect(provider).toBe(cloudflareProvider);
      expect(ethers.providers.CloudflareProvider).toHaveBeenCalledWith('mainnet');
    });

    it('should use the defined network when set', () => {
      const provider = getProvider({ ...env, ETHEREUM_NETWORK: 'ropsten' });
      expect(provider).toBe(cloudflareProvider);
      expect(ethers.providers.CloudflareProvider).toHaveBeenCalledWith('ropsten');
    });
  });

  describe('when enabling JSON_RPC_PROVIDER', () => {
    const env = {
      JSON_RPC_URL: 'https://rpc.ankr.com/gnosis'
    };

    it('should use the provider', () => {
      const provider = getProvider(env);
      expect(provider).toBe(jsonRPCProvider);
      expect(ethers.providers.JsonRpcProvider).toHaveBeenCalledWith(env.JSON_RPC_URL, 'mainnet');
    });

    it('should use the defined network when set', () => {
      const provider = getProvider({ ...env, ETHEREUM_NETWORK: 'ropsten' });
      expect(provider).toBe(jsonRPCProvider);
      expect(ethers.providers.JsonRpcProvider).toHaveBeenCalledWith(env.JSON_RPC_URL, 'ropsten');
    });
  });

  describe('when enabling etherscan', () => {
    const env = {
      ETHERSCAN_API_KEY: 'api key 1234'
    };

    it('should use the provider', () => {
      const provider = getProvider(env);
      expect(provider).toBe(etherscanProvider);
      expect(ethers.providers.EtherscanProvider)
        .toHaveBeenCalledWith('mainnet', env.ETHERSCAN_API_KEY);
    });

    it('should use the defined network when set', () => {
      const provider = getProvider({ ...env, ETHEREUM_NETWORK: 'ropsten' });
      expect(provider).toBe(etherscanProvider);
      expect(ethers.providers.EtherscanProvider)
        .toHaveBeenCalledWith('ropsten', env.ETHERSCAN_API_KEY);
    });
  });

  describe('when enabling alchemy', () => {
    const env = {
      ALCHEMY_API_KEY: 'api key 1234'
    };

    it('should use the provider', () => {
      const provider = getProvider(env);
      expect(provider).toBe(alchemyProvider);
      expect(ethers.providers.AlchemyProvider)
        .toHaveBeenCalledWith('mainnet', env.ALCHEMY_API_KEY);
    });

    it('should use the defined network when set', () => {
      const provider = getProvider({ ...env, ETHEREUM_NETWORK: 'ropsten' });
      expect(provider).toBe(alchemyProvider);
      expect(ethers.providers.AlchemyProvider)
        .toHaveBeenCalledWith('ropsten', env.ALCHEMY_API_KEY);
    });
  });

  describe('when setting pocket variables', () => {
    const env = {
      POCKET_APPLICATION_ID: 'app-id',
      POCKET_APPLICATION_SECRET_KEY: 'app-secret',
    };

    it('should not use the default provider', () => {
      getProvider(env);
      expect(ethers.providers.getDefaultProvider)
        .not.toHaveBeenCalledWith('mainnet');
    });

    it('should use the PocketProvider', () => {
      const provider = getProvider(env);
      expect(provider).toBe(pocketProvider);
      expect(ethers.providers.PocketProvider).toHaveBeenCalledWith('mainnet', {
        applicationId: env.POCKET_APPLICATION_ID,
        applicationSecretKey: env.POCKET_APPLICATION_SECRET_KEY,
      })
    });

    it('should use the proper network when set', () => {
      const provider = getProvider({ ...env, ETHEREUM_NETWORK: 'ropsten' });
      expect(provider).toBe(pocketProvider);
      expect(ethers.providers.PocketProvider).toHaveBeenCalledWith('ropsten', {
        applicationId: env.POCKET_APPLICATION_ID,
        applicationSecretKey: env.POCKET_APPLICATION_SECRET_KEY,
      })
    });

    it('should fail when no application_id is provided', () => {
      expect(() => getProvider({ ...env, POCKET_APPLICATION_ID: undefined }))
        .toThrow('missing POCKET_APPLICATION_ID secret');
    });

    it('should fail when no application_secret is provided', () => {
      expect(() => getProvider({ ...env, POCKET_APPLICATION_SECRET_KEY: undefined }))
        .toThrow('missing POCKET_APPLICATION_SECRET_KEY secret');
    });
  });

  describe('when enabling ankr', () => {
    const env = {
      ANKR_API_KEY: 'api key 1234'
    };

    it('should use the provider', () => {
      const provider = getProvider(env);
      expect(provider).toBe(ankrProvider);
      expect(ethers.providers.AnkrProvider).toHaveBeenCalledWith('mainnet', env.ANKR_API_KEY);
    });

    it('should use the proper network when set', () => {
      const provider = getProvider({ ...env, ETHEREUM_NETWORK: 'ropsten' });
      expect(provider).toBe(ankrProvider);
      expect(ethers.providers.AnkrProvider).toHaveBeenCalledWith('ropsten', env.ANKR_API_KEY);
    });

  });

  describe('when enabling two providers', () => {
    const env = {
      ANKR_API_KEY: 'api key 1234',
      CLOUDFLARE_ENABLED: '1'
    };


    it('should use both providers on a fallback provider', () => {
      const provider = getProvider(env)

      expect(ethers.providers.AnkrProvider)
        .toHaveBeenCalledWith('mainnet', env.ANKR_API_KEY);

      expect(ethers.providers.CloudflareProvider)
        .toHaveBeenCalledWith('mainnet');

      expect(ethers.providers.FallbackProvider)
        .toHaveBeenCalledWith([cloudflareProvider, ankrProvider]);

      expect(provider).toBe(fallbackProvider);
    });

    it('should use quorum variable if defined', () => {
      getProvider({ ...env, FALLBACK_QUORUM: '1' })
      expect(ethers.providers.FallbackProvider)
        .toHaveBeenCalledWith([cloudflareProvider, ankrProvider], 1);
    });
  });
});
