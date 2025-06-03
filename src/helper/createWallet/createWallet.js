const { Turnkey } = require('@turnkey/sdk-server');
require('dotenv').config({path: '../../../.env'});
const env = {
  organizationId: process.env.TURNKEY_ORGANIZATION_ID,    // Your root organization ID from Turnkey dashboard
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY,     // Private key for signing API requests
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY,       // Public key associated with the private key
  apiBaseUrl: "https://api.turnkey.com"                   // Turnkey's API endpoint
};
console.log(env)
 async function generateSolanaWallet(walletName) {
  try {
    // Step 1: Initialize the Turnkey client
    // This sets up the connection to Turnkey's API with your credentials
    console.log('🔧 Initializing Turnkey client...');
    const turnkey = new Turnkey({
      defaultOrganizationId: env.organizationId,    // Which organization to create wallet under
      apiBaseUrl: env.apiBaseUrl,                   // Turnkey API endpoint
      apiPrivateKey: env.apiPrivateKey,             // Your private key for signing requests
      apiPublicKey: env.apiPublicKey,               // Your public key for verification
    });

    // Step 2: Create an API client
    // This client will automatically sign all requests with your API credentials
    console.log('📡 Creating API client...');
    const apiClient = turnkey.apiClient();

    // Step 3: Generate a unique wallet name if none provided
    // This ensures each wallet has a unique identifier
    const finalWalletName = walletName || `solana-wallet-${Date.now()}`;
    console.log(`🎯 Creating Solana wallet: ${finalWalletName}`);

    // Step 4: Create the Solana wallet
    // Solana configuration:
    // - curve: ED25519 (Solana uses Ed25519 cryptographic curve)
    // - pathFormat: BIP32 (standard hierarchical deterministic wallet format)
    // - path: m/44'/501'/0'/0' (Solana's standard derivation path, 501 is Solana's coin type)
    const walletResponse = await apiClient.createWallet({
      organizationId: env.organizationId,           // Target organization
      walletName: finalWalletName,                  // Name for this wallet
      accounts: [{
        curve: 'CURVE_ED25519',                     // Solana uses Ed25519 curve (different from Bitcoin/Ethereum)
        pathFormat: 'PATH_FORMAT_BIP32',            // Standard wallet derivation format
        path: "m/44'/501'/0'/0'",                    // Solana derivation path (501 = Solana coin type)
        addressFormat: 'ADDRESS_FORMAT_SOLANA'
      }]
    });

    // Step 5: Check if wallet creation was successful
    if (walletResponse && walletResponse.walletId) {
      console.log('✅ Solana wallet created successfully!');
      console.log(`📝 Wallet ID: ${walletResponse.walletId}`);

      // Step 6: Get wallet details including the Solana address
      console.log('🔍 Fetching wallet details...');
      const walletDetails = await apiClient.getWallet({
        organizationId: env.organizationId,
        walletId: walletResponse.walletId
      });

      // Step 7: Extract Solana address from wallet details
      // The address is the public key that others can send SOL to
      let solanaAddress = null;
      if (walletDetails && walletDetails.accounts && walletDetails.accounts.length > 0) {
        solanaAddress = walletDetails.accounts[0].address;
        console.log(`🏠 Solana Address: ${solanaAddress}`);
      }

      // Step 8: Return complete wallet information
      return {
        success: true,
        walletId: walletResponse.walletId,          // Unique identifier for this wallet
        walletName: finalWalletName,                // Human-readable name
        solanaAddress: solanaAddress,               // Public address for receiving SOL
        curve: 'ED25519',                           // Cryptographic curve used
        derivationPath: "m/44'/501'/0'/0'",         // How the keys were derived
        createdAt: new Date().toISOString()         // When the wallet was created
      };
    } else {
      // Wallet creation failed - no wallet ID returned
      throw new Error('Wallet creation failed - no wallet ID returned from API');
    }

  } catch (error) {
    // Handle any errors that occurred during wallet creation
    console.error('❌ Error creating Solana wallet:', error.message);
    return {
      success: false,
      error: error.message,
      details: error
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
  const wallet = await generateSolanaWallet('my-test-solana-wallet');
  
  if (wallet.success) {
    console.log('\n🎉 Wallet Details:');
    console.log(`   Name: ${wallet.walletName}`);
    console.log(`   ID: ${wallet.walletId}`);
    console.log(`   Address: ${wallet.solanaAddress}`);
    console.log(`   Created: ${wallet.createdAt}`);
  } else {
    console.log('\n💥 Wallet creation failed:', wallet.error);
  }

  // List all wallets
  console.log('\n📊 All wallets in organization:');
  const allWallets = await listAllWallets();
  allWallets.forEach((wallet, index) => {
    console.log(`   ${index + 1}. ${wallet.walletName} (${wallet.walletId})`);
  });
}

// Export functions for use in other files
module.exports = {
  generateSolanaWallet,
  listAllWallets,
  example
};

// Run example if this file is executed directly
if (require.main === module) {
  example();
} 