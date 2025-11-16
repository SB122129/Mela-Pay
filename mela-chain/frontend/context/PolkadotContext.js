import { createContext, useContext, useState, useEffect } from 'react';
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

  // -------------------------
  // POLKADOT API INITIALIZATION
  // -------------------------
  useEffect(() => {
    const initApi = async () => {
      try {
        const wsProvider = new WsProvider('wss://rpc.polkadot.io');
        const apiInstance = await ApiPromise.create({ provider: wsProvider });
        setApi(apiInstance);
        console.log("✅ Polkadot API connected");
      } catch (err) {
        console.error("Failed to connect Polkadot API:", err);
        setError("Failed to connect to Polkadot network");
      }
    };

    initApi();
  }, []);

  // -------------------------
  // CONNECT WALLET
  // -------------------------
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Prevent SSR load
      if (typeof window === "undefined") return;

      // Dynamic import (fixes SSR crash)
      const {
        web3Enable,
        web3Accounts
      } = await import("@polkadot/extension-dapp");

      const extensions = await web3Enable("Mela Chain");
      if (extensions.length === 0) {
        throw new Error("No Polkadot extension found. Install Polkadot.js extension.");
      }

      const allAccounts = await web3Accounts();
      if (allAccounts.length === 0) {
        throw new Error("No accounts found in Polkadot extension.");
      }

      setAccounts(allAccounts);
      setSelectedAccount(allAccounts[0]);

      return allAccounts;
    } catch (err) {
      console.error("Wallet connection error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  // -------------------------
  // DISCONNECT WALLET
  // -------------------------
  const disconnectWallet = () => {
    setAccounts([]);
    setSelectedAccount(null);
    setError(null);
  };

  // -------------------------
  // SELECT ACCOUNT
  // -------------------------
  const selectAccount = (account) => {
    setSelectedAccount(account);
  };

  // -------------------------
  // SEND TRANSACTION
  // -------------------------
  const sendTransaction = async (recipientAddress, amount) => {
    if (!selectedAccount || !api) {
      throw new Error("Wallet not connected or API not ready");
    }

    try {
      const { web3FromAddress } = await import("@polkadot/extension-dapp");

      const injector = await web3FromAddress(selectedAccount.address);

      const tx = api.tx.balances.transfer(recipientAddress, amount);

      const hash = await tx.signAndSend(
        selectedAccount.address,
        { signer: injector.signer }
      );

      return hash.toHex();
    } catch (err) {
      console.error("Transaction error:", err);
      throw err;
    }
  };

  // -------------------------
  // GET BALANCE
  // -------------------------
  const getBalance = async (address) => {
    if (!api) throw new Error("API not ready");

    try {
      const { data: balance } = await api.query.system.account(address);
      return balance.free.toString();
    } catch (err) {
      console.error("Balance query error:", err);
      throw err;
    }
  };

  // -------------------------
  // PROVIDER VALUE
  // -------------------------
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
