import { NextRequest, NextResponse } from 'next/server'
// import { database, ref, set, get } from '../../../../firebase'  // Import Firebase database functions
import { db, collection, doc, getDocs, getDoc } from '../../../../firebase'; // Adjust import path as needed

export async function POST(req: NextRequest) {
    try {
        
        const { id } = await req.json();
        console.log("type", id);
        
        let data;
  
        if (id === 'latest') {
            // Fetch all NFT metadata
            const nftCollectionRef = collection(db, 'nft_metadata');
            const nftSnapshot = await getDocs(nftCollectionRef);
            
            // Find the latest NFT by timestamp
            let latestDoc = null;
            let latestTimestamp = '';
        
            nftSnapshot.forEach((doc: { data: () => any; id: any; }) => {
                const docData = doc.data();
                const timestamp = doc.id; // Assuming the timestamp is part of the document ID
        
                if (timestamp > latestTimestamp) {
                latestTimestamp = timestamp;
                latestDoc = docData;
                }
            });
        
            data = latestDoc;
        } else {
            // Fetch NFT data for a specific user
            const nftDocRef = doc(db, 'nft_metadata', id);
            const nftDoc = await getDoc(nftDocRef);
            data = nftDoc.exists() ? nftDoc.data() : null;
        }
      
  
        if (!data) {
            return NextResponse.json({ success: false, message: 'No data found' }, { status: 404 });
        }
  
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching NFT data:', error);
  
        // Ensure error is serializable
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
  }