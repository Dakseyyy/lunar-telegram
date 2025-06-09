const apiClient = require('./turnkeyClient');
require('dotenv').config({path: '../../../.env'});
const organizationID = process.env.TURNKEY_ORGANIZATION_ID;
const getWalletAccountsResponse = apiClient.getWalletAccounts({
    organizationId: organizationID,
    walletId: '329148dc-6b99-57ef-bb59-fd1ff1a86822'
})
const logData = async() => {
    let walletDetails = await getWalletAccountsResponse;
    console.log(walletDetails.accounts[0].address) 
}
logData()
