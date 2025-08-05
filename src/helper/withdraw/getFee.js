const { Message } = require("@solana/web3.js");

const getFee = async (rpc ) => {
  let b64Message =
    "AQABAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQAA";

  let message = Message.from(Buffer.from(b64Message, "base64"));
  const fee = await rpc.getFeeForMessage(message);
  return fee;
};

module.exports = getFee;