import { createContext, useContext, useState, useEffect } from 'react';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';

const PolkadotContext = createContext();

export const usePolkadot = () => {
  const context = useContext(PolkadotContext);
  if (!context) {
    throw new Error('usePolkadot must be used within PolkadotProvider');
  }
  return context;
};

export const PolkadotProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [api, setApi] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Polkadot API
  useEffect(() => {
    const initApi = async () => {
      try {
        // Connect to Polkadot relay chain (or use a testnet)
        const wsProvider = new WsProvider('wss://rpc.polkadot.io');
        const apiInstance = await ApiPromise.create({ provider: wsProvider });
        setApi(apiInstance);
        console.log('✅ Polkadot API connected');
      } catch (err) {
        console.error('Failed to connect to Polkadot API:', err);
        setError('Failed to connect to Polkadot network');
      }
    };

    initApi();

    return () => {
      if (api) {
        api.disconnect();
      }
    };
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Enable the extension
      const extensions = await web3Enable('Mela Chain');

      if (extensions.length === 0) {
        throw new Error('No Polkadot extension found. Please install Polkadot.js extension.');
      }

      // Get all accounts
      const allAccounts = await web3Accounts();

      if (allAccounts.length === 0) {
        throw new Error('No accounts found. Please create an account in your Polkadot wallet.');
      }

      setAccounts(allAccounts);
      setSelectedAccount(allAccounts[0]);

      return allAccounts;
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccounts([]);
    setSelectedAccount(null);
    setError(null);
  };

  const selectAccount = (account) => {
    setSelectedAccount(account);
  };

  const sendTransaction = async (recipientAddress, amount) => {
    if (!selectedAccount || !api) {
      throw new Error('Wallet not connected or API not ready');
    }

    try {
      // Get the injector for the selected account
      const injector = await web3FromAddress(selectedAccount.address);

      // Create transfer transaction
      const transfer = api.tx.balances.transfer(recipientAddress, amount);

      // Sign and send the transaction
      const hash = await transfer.signAndSend(
        selectedAccount.address,
        { signer: injector.signer }
      );

      return hash.toHex();
    } catch (err) {
      console.error('Transaction error:', err);
      throw err;
    }
  };

  const getBalance = async (address) => {
    if (!api) {
      throw new Error('API not ready');
    }

    try {
      const { data: balance } = await api.query.system.account(address);
      return balance.free.toString();
    } catch (err) {
      console.error('Balance query error:', err);
      throw err;
    }
  };

  const value = {
    accounts,
    selectedAccount,
    api,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    selectAccount,
    sendTransaction,
    getBalance,
    isConnected: accounts.length > 0
  };

  return (
    <PolkadotContext.Provider value={value}>
      {children}
    </PolkadotContext.Provider>
  );
};
