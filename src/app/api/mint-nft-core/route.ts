import { NextRequest, NextResponse } from 'next/server'
import { create, mplCore } from '@metaplex-foundation/mpl-core'
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
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


  // ** using uploaded images on Arweave **
  let imageUriString = '' 
  if(mintType == "Silver"){
    imageUriString = 'https://arweave.net/02hEPqsjtuiRTWxmUjH4pG7DhHcWhkgvQV4xJz6mCdM'
  }else if(mintType == "Gold"){
    imageUriString = 'https://arweave.net/tcWkmCJ-veSF0VMsYN0DhdOOHXaMKd_RTFKzYoIYLuA'
  }else if(mintType == "Default"){
    imageUriString = 'https://arweave.net/w39YFAUdVfHnlGjoGoL2idOFyfN6P75RMLKbykF8kK4'
  }
  

  // ** Upload Metadata to Arweave **
  const metadata = {
    name: user || 'My NFT Core',
    description: `Congratulations on ${mintType} Milestone`,
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


  // We generate a signer for the NFT
  const nftSigner = generateSigner(umi)
  console.log('Creating NFT...')
  await create(umi, { asset: nftSigner,name: user ? `${user} NFT ${mintType}` : "My NFT", uri: metadataUri,}).send(umi)

  // console.log('View NFT on Metaplex Explorer')
  // console.log(`https://core.metaplex.com/explorer/${nftSigner.publicKey}?env=devnet`)
  const metaplexExplorerUrl = `https://core.metaplex.com/explorer/${nftSigner.publicKey}?env=devnet`;
  return { metaplexExplorerUrl};

}

export async function POST(req: NextRequest) {
    try {
        const { mintType, user } = await req.json();
        console.log("mintType", mintType);
        console.log("user from dscvr", user);

        const { metaplexExplorerUrl } = await createNft(mintType, user)

        return NextResponse.json({ 
            success: true,
            metaplexExplorerUrl,
        }, { status: 200 });
    } catch (error) {
        console.error('Error creating NFT:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}


