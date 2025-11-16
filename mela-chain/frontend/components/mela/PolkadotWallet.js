import { useState, useEffect } from 'react';
import { usePolkadot } from '../../context/PolkadotContext';
import Button from '../ui/Button';

export default function PolkadotWallet({ onAccountSelect }) {
  const {
    accounts,
    selectedAccount,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    selectAccount,
    isConnected,
    getBalance
  } = usePolkadot();

  const [balances, setBalances] = useState({});
  const [loadingBalances, setLoadingBalances] = useState(false);

  useEffect(() => {
    if (accounts.length > 0) {
      loadBalances();
    }
  }, [accounts]);

  useEffect(() => {
    if (selectedAccount && onAccountSelect) {
      onAccountSelect(selectedAccount);
    }
  }, [selectedAccount]);

  const loadBalances = async () => {
    setLoadingBalances(true);
    const newBalances = {};

    for (const account of accounts) {
      try {
        const balance = await getBalance(account.address);
        // Convert from Planck to DOT (1 DOT = 10^10 Planck)
        newBalances[account.address] = (parseInt(balance) / 1e10).toFixed(4);
      } catch (err) {
        console.error('Error loading balance:', err);
        newBalances[account.address] = '0';
      }
    }

    setBalances(newBalances);
    setLoadingBalances(false);
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      // Error is already handled in context
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connect Polkadot Wallet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Connect your Polkadot wallet to make payments with DOT
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            size="lg"
          >
            {isConnecting ? (
              <>
                <div className="spinner w-5 h-5 mr-2 border-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Connect Wallet
              </>
            )}
          </Button>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Don't have a Polkadot wallet?</strong>
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Install the{' '}
              <a
                href="https://polkadot.js.org/extension/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                Polkadot.js Extension
              </a>
              {' '}to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Polkadot Wallet</h3>
        <Button variant="outline" size="sm" onClick={disconnectWallet}>
          Disconnect
        </Button>
      </div>

      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.address}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedAccount?.address === account.address
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => selectAccount(account)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {account.meta.name || 'Account'}
                  </span>
                  {selectedAccount?.address === account.address && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-600 text-white">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {formatAddress(account.address)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                <p className="font-bold text-primary-600 dark:text-primary-400">
                  {loadingBalances ? (
                    <span className="text-gray-400">...</span>
                  ) : (
                    `${balances[account.address] || '0'} DOT`
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {accounts.length > 1 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Click on an account to select it for payment
        </p>
      )}
    </div>
  );
}
