'use client';

import { useEffect, useState } from "react";
import { CanvasClient } from "@dscvr-one/canvas-client-sdk";


export default function Home() {
    // // To support TSX
    // const [mintAddress, setMintAddress] = useState<string | null>(null);
    // const [solanaExplorerUrl, setSolanaExplorerUrl] = useState<string | null>(null);
    // const [metaplexExplorerUrl, setMetaplexExplorerUrl] = useState<string | null>(null);
    // const [error, setError] = useState<string | null>(null);
    const [mintAddress, setMintAddress] = useState(null);
    const [solanaExplorerUrl, setSolanaExplorerUrl] = useState(null);
    const [metaplexExplorerUrl, setMetaplexExplorerUrl] = useState(null);
    const [error, setError] = useState(null);
    const [ mintType, setMintType ] = useState('')
    

    // Canvas SDK likes
    const [reactionCount, setReactionCount] = useState(0);

    const fetchData = async () => {
        try {
            const canvasClient = new CanvasClient();
            const handleContentReaction = (reactionResponse) => {
                console.log('Reaction received:', reactionResponse);
                const status = reactionResponse.untrusted.status;
                console.log('Reaction status:', status);

                if (status === 'reacted') {
                    setReactionCount((prevCount) => prevCount + 1);
                    console.log('User reacted to the content!');
                }
            };

            canvasClient.onContentReaction(handleContentReaction);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    const mintNftcore = async () => {

        try {

            await fetchData();
            
            // const response = await fetch('/api/mint-nft-core', { method: 'POST' });
            const response = await fetch('/api/mint-nft-core', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mintType }),
            });
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
        } catch (err) {
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
                <div className="mb-4">
                    <button
                        onClick={reactionCount === 1 ? () => {
                            mintNftcore();
                            setMintType('Silver');
                        } : null}
                        className={`px-6 py-3 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${reactionCount >= 2 ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400'}`}
                        disabled={reactionCount !== 1}
                    >
                        Mint NFT Silver
                    </button>
                    {reactionCount !== 1 && (
                        <p className="text-red-500 mt-2">Not enough reactions</p>
                    )}
                </div>

                {/* Gold Button */}
                <div className="mb-4">
                    <button
                        onClick={reactionCount === 2 ? () => {
                            mintNftcore();
                            setMintType('Gold');
                        } : null}
                        className={`px-6 py-3 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${reactionCount !== 2 ? 'bg-yellow-400 text-gray-700 cursor-not-allowed' : 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400'}`}
                        disabled={reactionCount !== 2}
                    >
                        Mint NFT Gold
                    </button>
                    {reactionCount !== 2 && (
                        <p className="text-red-500 mt-2">Not enough reactions</p>
                    )}
                </div>

                {/* Default Button */}
                <div>
                    {reactionCount !== 1 && reactionCount !== 2 && (
                        <>
                            <button
                                onClick={() => {
                                    mintNftcore();
                                    setMintType('Default');
                                }}
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Mint NFT For Fun
                            </button>
                        </>
                    )}
                </div>
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
