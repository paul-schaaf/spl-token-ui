import { PublicKey, Connection, clusterApiUrl, Account } from "@solana/web3.js";
import { Token } from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("testnet"), "singleGossip");

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
    4,
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

export const mintToken = async (dest: PublicKey, mintAuthority: PublicKey) => {
  if (!token) {
    throw new Error("No Token connection specified");
  }
  await token.mintTo(dest, mintAuthority, [], 550000);
};

export const getTokenBalance = async (tokenAccount: PublicKey) => {
  return (await token.getAccountInfo(tokenAccount)).amount;
};
