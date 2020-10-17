import { PublicKey, Connection, clusterApiUrl, Account } from "@solana/web3.js";
import { Token } from "@solana/spl-token";
const connection = new Connection(clusterApiUrl("testnet"), "single");

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export const createNewToken = async (authority: Account) => {
  return (
    await Token.createMint(
      connection,
      authority,
      authority.publicKey,
      authority.publicKey,
      9,
      TOKEN_PROGRAM_ID
    )
  ).publicKey.toString(); // property DOES exist, just isn't exposed (yet?). Add it to Token declare file before running locally
};
