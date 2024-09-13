'use client';

import { useEffect, useState } from "react";
import { CanvasClient } from "@dscvr-one/canvas-client-sdk";


export default function Home() {
    const [mintAddress, setMintAddress] = useState(null);
    // const [solanaExplorerUrl, setSolanaExplorerUrl] = useState(null);
    const [metaplexExplorerUrl, setMetaplexExplorerUrl] = useState(null);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);    

    // Canvas SDK likes
    const [reactionCount, setReactionCount] = useState(0);

    useEffect(() => {
        async function fetchData() {
        
        try {
          const canvasClient = new CanvasClient();
          const response = await canvasClient.ready();

          
          const handleContentReaction = async (reactionResponse) => {
            console.log('Reaction received:', reactionResponse);
            const status = reactionResponse.untrusted.status;
              console.log('Reaction status:', status);
              
              // Handle the reaction based on the status
              if (status === 'reacted') {
                new_count = reactionCount + 1;
                await setReactionCount(new_count);
                console.log('User reacted to the content!');
                console.log(reactionCount);
              }
          };
  
          canvasClient.onContentReaction(handleContentReaction);

          const key = canvasClient.connectWallet()
          console.log(key);
          

          if (response) {
            const user = response.untrusted.user;
            
            console.log(user.username);
  
            if (user) setUser(user.username);
          }
  
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      fetchData();
    }, []);
    
    const mintNftcore = async (type) => {
        try {
            console.log("mintType frontend", type);
            
            // const response = await fetch('/api/mint-nft-core', { method: 'POST' });
            const response = await fetch('/api/mint-nft-core', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mintType: type, user }),
            });
            const data = await response.json();
            console.log(data);
            
            if (data.success) {
                setMintAddress(data.success);
                setMetaplexExplorerUrl(data.metaplexExplorerUrl || null);
                setError(null);
            } else {
                setError(data.error);
                setMetaplexExplorerUrl(null);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            setMetaplexExplorerUrl(null);
        }
    };


    // return (
    //     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
    //         <div className="flex gap-4 mb-6">
    //             <div className="mb-4">
    //                 <button
    //                     onClick={reactionCount === 1 ? () => {
    //                         mintNftcore('Silver');
    //                     } : null}
    //                     className={`px-6 py-3 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${reactionCount >= 2 ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400'}`}
    //                     disabled={reactionCount !== 1}
    //                 >
    //                     Mint NFT Silver
    //                 </button>
    //                 {reactionCount !== 1 && (
    //                     <p className="text-red-500 mt-2">Not enough reactions</p>
    //                 )}
    //             </div>

    //             {/* Gold Button */}
    //             <div className="mb-4">
    //                 <button
    //                     onClick={reactionCount === 2 ? () => {
    //                         mintNftcore('Gold');
    //                     } : null}
    //                     className={`px-6 py-3 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${reactionCount !== 2 ? 'bg-yellow-400 text-gray-700 cursor-not-allowed' : 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400'}`}
    //                     disabled={reactionCount !== 2}
    //                 >
    //                     Mint NFT Gold
    //                 </button>
    //                 {reactionCount !== 2 && (
    //                     <p className="text-red-500 mt-2">Not enough reactions</p>
    //                 )}
    //             </div>

    //             {/* Default Button */}
    //             <div>
    //                 {reactionCount !== 1 && reactionCount !== 2 && (
    //                     <>
    //                         <button
    //                             onClick={() => {
    //                                 mintNftcore('Default');
    //                             }}
    //                             className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    //                         >
    //                             Mint NFT For Fun
    //                         </button>
    //                     </>
    //                 )}
    //             </div>
    //         </div>
    //         {mintAddress && (
    //             <div className="text-green-600 font-semibold text-lg">
    //                 <p>
    //                     NFT Minted: <span className="text-blue-600">{mintAddress}</span>
    //                 </p>
    //                 {metaplexExplorerUrl && (
    //                     <p>
    //                         View your NFT on Metaplex Explorer: 
    //                         <a href={metaplexExplorerUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
    //                             {metaplexExplorerUrl}
    //                         </a>
    //                     </p>
    //                 )}
    //             </div>
    //         )}
    //         {error && (
    //             <p className="text-red-600 font-semibold text-lg">
    //                 Error: <span className="text-red-800">{error}</span>
    //             </p>
    //         )}
    //     </div>
    // );
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
                    Milestone NFT Mint
                </h1>
                <p className="text-lg text-gray-100 mt-4">
                    Unlock exclusive NFTs by hitting engagement milestones:
                </p>
                <ul className="text-gray-200 mt-2 space-y-1">
                    <li>🌟 Silver NFT: Available at 0 reactions</li>
                    <li>🏆 Gold NFT: Available at 1 reaction</li>
                    <li>🎉 NFT for Fun: Always available</li>
                </ul>
            </div>
    
            {/* Button Section */}
            <div className="flex flex-col items-center space-y-6">
                {/* Silver Button */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={reactionCount === 0 ? () => mintNftcore('Silver') : null}
                        className={`px-8 py-3 text-lg font-bold rounded-full shadow-lg transform transition-transform focus:outline-none focus:ring-4 ${
                            reactionCount == 1
                                ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
                                : 'bg-gray-800 text-white hover:scale-105 hover:bg-gray-900 focus:ring-gray-400'
                        }`}
                    >
                        Mint Silver NFT
                    </button>
                </div>
    
                {/* Gold Button */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={reactionCount === 2 ? () => mintNftcore('Gold') : null}
                        className={`px-8 py-3 text-lg font-bold rounded-full shadow-lg transform transition-transform focus:outline-none focus:ring-4 ${
                            reactionCount !== 2
                                ? 'bg-yellow-300 text-gray-900 cursor-not-allowed'
                                : 'bg-yellow-500 text-white hover:scale-105 hover:bg-yellow-600 focus:ring-yellow-400'
                        }`}
                        disabled={reactionCount !== 2}
                    >
                        Mint Gold NFT
                    </button>
                    {reactionCount !== 2 && (
                        <p className="text-red-300 text-sm mt-2">Need more reactions to mint Gold NFT</p>
                    )}
                </div>
    
                {/* NFT for Fun Button */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={() => mintNftcore('Default')}
                        className="px-8 py-3 bg-blue-500 text-lg font-bold rounded-full text-white shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Mint NFT for Fun
                    </button>
                </div>
            </div>
    
            {/* Minted NFT Info */}
            {mintAddress && (
                <div className="mt-10 text-center">
                    <p className="text-lg text-green-200 font-semibold">
                        🎉 NFT Minted: <span className="text-green-400">{mintAddress}</span>
                    </p>
                    {metaplexExplorerUrl && (
                        <p>
                            View it on Metaplex Explorer: 
                            <a href={metaplexExplorerUrl} className="text-blue-200 hover:underline" target="_blank" rel="noopener noreferrer">
                                {metaplexExplorerUrl}
                            </a>
                        </p>
                    )}
                </div>
            )}
    
            {/* Error Message */}
            {error && (
                <div className="mt-10">
                    <p className="text-red-400 text-lg font-bold">
                        Error: <span className="text-red-600">{error}</span>
                    </p>
                </div>
            )}
        </div>
    );
    
    
    
}
