import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  sendAndConfirmTransaction as realSendAndConfirmTransaction,
  Transaction,
  Connection,
  Account
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { createAccount } from "@/solana/account";
import { COMMITMENT, getConnection } from "../connection";
import { sendTxUsingExternalSignature, useWallet } from "../externalWallet";

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const findAssociatedTokenAccountPublicKey = async (
  ownerPublicKey: PublicKey,
  tokenMintPublicKey: PublicKey
) =>
  (
    await PublicKey.findProgramAddress(
      [
        ownerPublicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintPublicKey.toBuffer()
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];

const createIx = (
  funderPubkey: PublicKey,
  associatedTokenAccountPublicKey: PublicKey,
  ownerPublicKey: PublicKey,
  tokenMintPublicKey: PublicKey
) =>
  new TransactionInstruction({
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
    keys: [
      { pubkey: funderPubkey, isSigner: true, isWritable: true },
      {
        pubkey: associatedTokenAccountPublicKey,
        isSigner: false,
        isWritable: true
      },
      { pubkey: ownerPublicKey, isSigner: false, isWritable: false },
      { pubkey: tokenMintPublicKey, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }
    ]
  });

export const createAssociatedTokenAccount = async (
  feePayerSecret: string,
  feePayerSignsExternally: boolean,
  tokenMintAddress: string,
  ownerAddress: string
) => {
  const tokenMintPublicKey = new PublicKey(tokenMintAddress);
  const ownerPublicKey = new PublicKey(ownerAddress);
  const associatedTokenAccountPublicKey = await findAssociatedTokenAccountPublicKey(
    ownerPublicKey,
    tokenMintPublicKey
  );
  const connection = getConnection();

  if (feePayerSignsExternally) {
    const wallet = await useWallet();
    const ix = createIx(
      wallet.publicKey,
      associatedTokenAccountPublicKey,
      ownerPublicKey,
      tokenMintPublicKey
    );

    await sendTxUsingExternalSignature([ix], connection, null, [], wallet);
  } else {
    const feePayerAccount = await createAccount(feePayerSecret);
    const ix = createIx(
      feePayerAccount.publicKey,
      associatedTokenAccountPublicKey,
      ownerPublicKey,
      tokenMintPublicKey
    );

    await sendAndConfirmTransaction(
      connection,
      new Transaction().add(ix),
      feePayerAccount
    );
  }

  return associatedTokenAccountPublicKey.toBase58();
};

export function sendAndConfirmTransaction(
  connection: Connection,
  transaction: Transaction,
  ...signers: Account[]
) {
  return realSendAndConfirmTransaction(connection, transaction, signers, {
    skipPreflight: false,
    commitment: COMMITMENT
  });
}
