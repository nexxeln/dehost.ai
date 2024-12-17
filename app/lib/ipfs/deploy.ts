import lighthouse from '@lighthouse-web3/sdk';

export async function deployToIPFS(htmlContent: string, apiKey: string) {
  try {
    // Convert HTML content to buffer
    const buffer = Buffer.from(htmlContent);

    // Upload to IPFS via Lighthouse
    const response = await lighthouse.uploadBuffer(buffer, apiKey);

    if (!response.data) {
      throw new Error('Failed to upload to IPFS');
    }

    // Return the IPFS hash and gateway URL
    return {
      hash: response.data.Hash,
      url: `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`,
    };
  } catch (error) {
    console.error('IPFS deployment error:', error);
    throw error;
  }
}
