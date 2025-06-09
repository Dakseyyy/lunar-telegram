const { Turnkey } = require('@turnkey/sdk-server');
require('dotenv').config({path: '../../../.env'});
const apiClient = require('./turnkeyClient');
const env = {
  organizationId: process.env.TURNKEY_ORGANIZATION_ID,    // Your root organization ID from Turnkey dashboard
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY,     // Private key for signing API requests
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY,       // Public key associated with the private key
  apiBaseUrl: "https://api.turnkey.com"                   // Turnkey's API endpoint
};

 async function generateSolanaWallet(walletName) {
  try {
    

    // Step 3: Generate a unique wallet name if none provided
    if (!walletName) {
      console.error('NO_USER_ID_FOR_WALLET_GEN')
      return {
        success: false,
        error: 'Missing telegram user ID'
      }
    }
    const walletResponse = await apiClient.createWallet({
      organizationId: env.organizationId,           // Target organization
      walletName: walletName,                  // Name for this wallet
      accounts: [{
        curve: 'CURVE_ED25519',                     // Solana uses Ed25519 curve (different from Bitcoin/Ethereum)
        pathFormat: 'PATH_FORMAT_BIP32',            // Standard wallet derivation format
        path: "m/44'/501'/0'/0'",                    // Solana derivation path (501 = Solana coin type)
        addressFormat: 'ADDRESS_FORMAT_SOLANA'
      }]
    });

    // Step 5: Check if wallet creation was successful
    if (walletResponse && walletResponse.walletId) {

      // Step 6: Get wallet details including the Solana address
      const walletDetails = await apiClient.getWallet({
        organizationId: env.organizationId,
        walletId: walletResponse.walletId
      });
      let walletAccounts = await apiClient.getWalletAccounts({
                organizationId: env.organizationId,
                walletId: walletResponse.walletId
      })
      // Step 7: Extract Solana address from wallet details
      // The address is the public key that others can send SOL to
      let solanaAddress = null;
      if (walletAccounts) {
        solanaAddress = walletAccounts.accounts[0].address;
      }

      // Step 8: Return complete wallet information
      return {
        success: true,
        walletId: walletResponse.walletId,          // Unique identifier for this wallet
        walletName: walletName,                // Human-readable name
        solanaAddress: solanaAddress,               // Public address for receiving SOL
        createdAt: new Date().toISOString()         // When the wallet was created
      };
    } else {
      // Wallet creation failed - no wallet ID returned
      
      return {
        success: false,
        error: 'No wallet ID returned'
      }
    }

  } catch (error) {
    // Handle any errors that occurred during wallet creation
    console.error('❌ Error creating Solana wallet:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}


async function listAllWallets() {
  try {
    console.log('📋 Fetching all wallets...');
    
    // Initialize Turnkey client
    const turnkey = new Turnkey({
      defaultOrganizationId: env.organizationId,
      apiBaseUrl: env.apiBaseUrl,
      apiPrivateKey: env.apiPrivateKey,
      apiPublicKey: env.apiPublicKey,
    });

    const apiClient = turnkey.apiClient();

    // Get all wallets in the organization
    const response = await apiClient.getWallets({
      organizationId: env.organizationId
    });

    return response.wallets || [];
  } catch (error) {
    console.error('❌ Error fetching wallets:', error.message);
    return [];
  }
}


async function example() {
  console.log('🚀 Starting Solana wallet generation example...\n');

  // Generate a new Solana wallet
  const wallet = await generateSolanaWallet('test-solana-4');
  
  if (wallet.success) {
    console.log('\n🎉 Wallet Details:');
    console.log(`   Name: ${wallet.walletName}`);
    console.log(`   ID: ${wallet.walletId}`);
    console.log(`   Address: ${wallet.solanaAddress}`);
    console.log(`   Created: ${wallet.createdAt}`);
  } else {
    console.log('\n💥 Wallet creation failed:', wallet.error);
  }
}

// Export functions for use in other files
module.exports = {
  generateSolanaWallet,
  listAllWallets
};

// Run example if this file is executed directly
if (require.main === module) {
  example();
}
