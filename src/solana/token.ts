import { PublicKey, Connection, clusterApiUrl, Account } from "@solana/web3.js";
import { Token } from "@solana/spl-token";
const connection = new Connection(clusterApiUrl("testnet"), "single");

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

let token: Token;

export const createNewToken = async (authority: Account) => {
  token = await Token.createMint(
    connection,
    authority,
    authority.publicKey,
    authority.publicKey,
    9,
    TOKEN_PROGRAM_ID
  );
  return token.publicKey.toString(); // property DOES exist, just isn't exposed (yet?). Add it to Token declare file before running locally
};

export const createNewTokenAccount = async (owner: PublicKey) => {
  if (!token) {
    throw new Error("No Token connection specified");
  }
  return await token.createAccount(owner);
};
