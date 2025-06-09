const { Turnkey } = require('@turnkey/sdk-server');
require('dotenv').config({path: '../../../.env'});

// env stuff
const env = {
  organizationId: process.env.TURNKEY_ORGANIZATION_ID,    
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY,     
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY,       
  apiBaseUrl: "https://api.turnkey.com"                   
};

// init turn key client
const turnkey = new Turnkey({
      defaultOrganizationId: env.organizationId,   
      apiBaseUrl: env.apiBaseUrl,                   
      apiPrivateKey: env.apiPrivateKey,       
      apiPublicKey: env.apiPublicKey, 
    });

module.exports = turnkey.apiClient();