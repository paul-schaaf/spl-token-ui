import { PublicKey } from "@solana/web3.js";
import { Token } from "@solana/spl-token";
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
  return token.publicKey.toString();
};
