'use client';

import { useState } from 'react';

export default function Home() {
    const [mintAddress, setMintAddress] = useState<string | null>(null);
    const [solanaExplorerUrl, setSolanaExplorerUrl] = useState<string | null>(null);
    const [metaplexExplorerUrl, setMetaplexExplorerUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mintNftcore = async () => {
        try {
            const response = await fetch('/api/mint-nft-core', { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                setMintAddress(data.success);
                setSolanaExplorerUrl(data.solanaExplorerUrl || null);
                setMetaplexExplorerUrl(data.metaplexExplorerUrl || null);
                setError(null);
            } else {
                setError(data.error);
                setMintAddress(null);
                setSolanaExplorerUrl(null);
                setMetaplexExplorerUrl(null);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            setMintAddress(null);
            setSolanaExplorerUrl(null);
            setMetaplexExplorerUrl(null);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="flex gap-4 mb-6">
                <button
                    onClick={mintNftcore}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Mint NFT Core
                </button>
            </div>
            {mintAddress && (
                <div className="text-green-600 font-semibold text-lg">
                    <p>
                        NFT Minted: <span className="text-blue-600">{mintAddress}</span>
                    </p>
                    {solanaExplorerUrl && (
                        <p>
                            View your NFT on Solana Explorer: 
                            <a href={solanaExplorerUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                                {solanaExplorerUrl}
                            </a>
                        </p>
                    )}
                    {metaplexExplorerUrl && (
                        <p>
                            View your NFT on Metaplex Explorer: 
                            <a href={metaplexExplorerUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                                {metaplexExplorerUrl}
                            </a>
                        </p>
                    )}
                </div>
            )}
            {error && (
                <p className="text-red-600 font-semibold text-lg">
                    Error: <span className="text-red-800">{error}</span>
                </p>
            )}
        </div>
    );
}
