import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getConnection } from "./connection";

export const requestAirdrop = (accountAddress: string, amountInSOL: number) => {
  return getConnection().requestAirdrop(
    new PublicKey(accountAddress),
    amountInSOL * LAMPORTS_PER_SOL
  );
};
