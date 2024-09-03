export const maxDuration = 10; // This function can run for a maximum of 5 seconds

import { NextRequest, NextResponse } from 'next/server'
import { create, mplCore } from '@metaplex-foundation/mpl-core'
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { Metaplex } from '@metaplex-foundation/js'
import fs from 'fs'
import path from 'path'


const createNft = async (mintType: string, user: string) => {
  
  const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(irysUploader())
  
  const walletFilePath = path.join(process.cwd(), 'src', '..', 'wallet.json');
  const walletFile = fs.readFileSync(walletFilePath, 'utf8');
  const secretKeyArray = new Uint8Array(JSON.parse(walletFile));
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKeyArray);
  umi.use(keypairIdentity(keypair));
  
  const balance = await umi.rpc.getBalance(umi.identity.publicKey);
  if (balance < sol(1)) {
    console.log('Balance is less than 1 SOL, airdropping 1 SOL...');
    await umi.rpc.airdrop(umi.identity.publicKey, sol(1));
    console.log('Airdrop complete.');
  } else {
    console.log('Balance is sufficient:', balance );
  }


  // ** Upload an image to Arweave **
  
  let image_path = ''
  let imageUriString = '' 
  if(mintType == "Silver"){
    image_path = "silver_button.png"
  }else if(mintType == "Gold"){
    image_path = "gold_button.png"
  }else if(mintType == "Default"){
    image_path = "diamond_button.png"
    imageUriString = 'https://arweave.net/w39YFAUdVfHnlGjoGoL2idOFyfN6P75RMLKbykF8kK4'
  }
  
  const imageFile = fs.readFileSync(
    path.join(process.cwd(), 'uploads', image_path)
  )

  const umiImageFile = createGenericFile(imageFile, image_path, {
    tags: [{ name: 'Content-Type', value: 'image/png' }],
  })

  if(mintType !== "Default"){  
    console.log(`Uploading Image...${image_path}`)
    try {
      const imageUri = await umi.uploader.upload([umiImageFile]);
      imageUriString = imageUri[0];
      console.log('imageUri: ' + imageUriString);
    } catch (err) {
        throw new Error();
    }
}

  // ** Upload Metadata to Arweave **
  const metadata = {
    name: user || 'My NFT',
    description: 'This is an NFT on Solana',
    image: imageUriString,
    external_url: 'https://example.com',
    attributes: [
      {
        trait_type: 'trait1',
        value: 'value1',
      },
      {
        trait_type: 'trait2',
        value: 'value2',
      },
    ],
    properties: {
      files: [
        {
          uri: imageUriString,
          type: 'image/jpeg',
        },
      ],
      category: 'image',
    },
  }

  console.log('Uploading Metadata...')
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err)
  })

  // ** Creating the NFT **

  // We generate a signer for the NFT
  const nftSigner = generateSigner(umi)

  console.log('Creating NFT...')
  const tx = await create(umi, {
    asset: nftSigner,
    name: 'My NFT',
    uri: metadataUri,
  }).sendAndConfirm(umi)

  const signature = base58.deserialize(tx.signature)[0]

  console.log('\nNFT Created')
  console.log('View Transaction on Solana Explorer')
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  console.log('\n')
  console.log('View NFT on Metaplex Explorer')
  console.log(`https://core.metaplex.com/explorer/${nftSigner.publicKey}?env=devnet`)

  const solanaExplorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
  const metaplexExplorerUrl = `https://core.metaplex.com/explorer/${nftSigner.publicKey}?env=devnet`;

  return { solanaExplorerUrl, metaplexExplorerUrl };
}


export async function POST(req: NextRequest) {
    try {
        const { mintType, user } = await req.json();
        console.log("mintType", mintType);
        console.log("user from dscvr", user);
        
        const { solanaExplorerUrl, metaplexExplorerUrl } = await createNft(mintType, user);
        return NextResponse.json({ 
            success: true,
            solanaExplorerUrl,
            metaplexExplorerUrl
        });
    } catch (error) {
        console.error('Error creating NFT:', error);

        // Ensure error is serializable
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}


const fetchNftsForWallet = async (publicKey: PublicKey) => {

  const connection = new Connection(clusterApiUrl('devnet'));
  const metaplex = new Metaplex(connection);

  const nfts = await metaplex
    .nfts()
    .findAllByOwner(publicKey);

  return nfts.map((nft) => ({
    name: nft.name,
    uri: nft.uri,
    mintAddress: nft.mintAddress.toBase58(),
  }));
};

export async function GET(req: NextRequest) {
  try {
    const walletFilePath = path.join(process.cwd(), 'src', '..', 'wallet.json');
    const walletFile = fs.readFileSync(walletFilePath, 'utf8');
    const secretKeyArray = new Uint8Array(JSON.parse(walletFile));
    const keypair = createUmi('https://api.devnet.solana.com').eddsa.createKeypairFromSecretKey(secretKeyArray);
    const publicKeyWallet = keypair.publicKey;
    const nfts = await fetchNftsForWallet(publicKeyWallet);

    return NextResponse.json({
      success: true,
      nfts,
    });
  } catch (error) {
    console.error('Error fetching NFTs:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

