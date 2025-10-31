const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { mplTokenMetadata } = require('@metaplex-foundation/mpl-token-metadata');
const { publicKey } = require('@metaplex-foundation/umi');
const { fetchDigitalAsset } = require('@metaplex-foundation/mpl-token-metadata');
const rpc = require('../clients/rpcClient');
const umi = createUmi(rpc).use(mplTokenMetadata());
async function getMetadata(mintAddress) {
    try {

      

        const mint = publicKey(mintAddress);
        const asset = await fetchDigitalAsset(umi, mint);
        console.log({
            ticker: asset.metadata.symbol || 'SPL',
            name: asset.metadata.name || 'SPL TOKEN',
            authority: asset.metadata.updateAuthority

        })
        return {
            ticker: asset.metadata.symbol || 'SPL',
            name: asset.metadata.name || 'SPL TOKEN',
            authority: asset.metadata.updateAuthority

        }; // This is the decoded metadata object
    } catch (e) {
        console.error(e);
    }
}
getMetadata('FzapAu8s76jMefnBEVTuVKAk7rTA2NTgY3nMPcZ5UrQn')
module.exports = getMetadata