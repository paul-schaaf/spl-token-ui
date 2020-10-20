import { PublicKey } from "@solana/web3.js";
import { AuthorityType, Token } from "@solana/spl-token";
import { getConnection } from "../solana/connection";
import { createAccount } from "./account";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export const createNewToken = async (
  feePayer: string,
  mintAuthority: string,
  freezeAuthority: string,
  decimals: number
) => {
  const token = await Token.createMint(
    getConnection(),
    await createAccount(feePayer),
    new PublicKey(mintAuthority),
    freezeAuthority ? new PublicKey(freezeAuthority) : null,
    decimals,
    TOKEN_PROGRAM_ID
  );
  // @ts-ignore
  return token.publicKey.toString();
};

export const editToken = async (
  feePayer: string,
  tokenAddress: string,
  newAuthority: string,
  currentAuthority: string,
  authorityType: AuthorityType
) => {
  const tokenPublicKey = new PublicKey(tokenAddress);

  const token = new Token(
    getConnection(),
    tokenPublicKey,
    TOKEN_PROGRAM_ID,
    await createAccount(feePayer)
  );

  await token.setAuthority(
    tokenPublicKey,
    new PublicKey(newAuthority),
    authorityType,
    await createAccount(currentAuthority),
    []
  );
};

export const createTokenAccount = async (
  feePayer: string,
  tokenAddress: string,
  owner: string
) => {
  const token = new Token(
    getConnection(),
    new PublicKey(tokenAddress),
    TOKEN_PROGRAM_ID,
    await createAccount(feePayer)
  );

  return (await token.createAccount(new PublicKey(owner))).toString();
};

export const mintToken = async (
  feePayer: string,
  tokenAddress: string,
  mintAuthority: string,
  destinationAccount: string,
  amount: number
) => {
  const token = new Token(
    getConnection(),
    new PublicKey(tokenAddress),
    TOKEN_PROGRAM_ID,
    await createAccount(feePayer)
  );

  return await token.mintTo(
    new PublicKey(destinationAccount),
    await createAccount(mintAuthority),
    [],
    amount
  );
};
