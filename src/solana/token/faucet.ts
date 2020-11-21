import { u64, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Account,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction
} from "@solana/web3.js";
import { createAccount } from "../account";
import { COMMITMENT, getConnection } from "../connection";
import { sendTxUsingExternalSignature, useWallet } from "../externalWallet";

const FAUCET_PROGRAM_ID = new PublicKey(
  "DH6gwMhqenesvKazacaRgbB5PiNAB9cS9VVWuW3FgnYP"
);

const getPDA = () =>
  PublicKey.findProgramAddress([Buffer.from("faucet")], FAUCET_PROGRAM_ID);

const buildCreateFaucetIx = (
  tokenMintPublicKey: PublicKey,
  faucetAccountPublicKey: PublicKey,
  adminAddress: string,
  amount: u64
) => {
  const keys = [
    { pubkey: tokenMintPublicKey, isSigner: false, isWritable: false },
    {
      pubkey: faucetAccountPublicKey,
      isSigner: false,
      isWritable: true
    },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }
  ];

  if (adminAddress) {
    keys.push({
      pubkey: new PublicKey(adminAddress),
      isSigner: false,
      isWritable: false
    });
  }

  return new TransactionInstruction({
    programId: FAUCET_PROGRAM_ID,
    data: Buffer.from([0, ...amount.toArray("le", 8)]),
    keys
  });
};

export const createFaucet = async (
  feePayerSecret: string,
  feePayerSignsExternally: boolean,
  mintAuthoritySecret: string,
  mintAuthoritySignsExternally: boolean,
  tokenMintAddress: string,
  adminAddress: string,
  amount: u64
) => {
  const tokenMintPublicKey = new PublicKey(tokenMintAddress);
  const connection = getConnection();
  const faucetAcc = new Account();

  const createFaucetIx = buildCreateFaucetIx(
    tokenMintPublicKey,
    faucetAcc.publicKey,
    adminAddress,
    amount
  );

  if (feePayerSignsExternally || mintAuthoritySignsExternally) {
    const wallet = await useWallet();

    const feePayerAccOrWallet = feePayerSignsExternally
      ? wallet
      : await createAccount(feePayerSecret);

    const createAccIx = SystemProgram.createAccount({
      fromPubkey: feePayerAccOrWallet.publicKey,
      newAccountPubkey: faucetAcc.publicKey,
      programId: FAUCET_PROGRAM_ID,
      space: 45,
      lamports: await connection.getMinimumBalanceForRentExemption(
        45,
        COMMITMENT
      )
    });

    const mintAuthorityAccOrWallet = mintAuthoritySignsExternally
      ? wallet
      : await createAccount(mintAuthoritySecret);

    const transferAuthorityIx = Token.createSetAuthorityInstruction(
      TOKEN_PROGRAM_ID,
      tokenMintPublicKey,
      (await getPDA())[0],
      "MintTokens",
      mintAuthorityAccOrWallet.publicKey,
      //@ts-expect-error
      []
    );

    await sendTxUsingExternalSignature(
      [createAccIx, transferAuthorityIx, createFaucetIx],
      connection,
      feePayerSignsExternally ? null : feePayerAccOrWallet,
      mintAuthoritySignsExternally
        ? [faucetAcc]
        : [mintAuthorityAccOrWallet, faucetAcc],
      wallet
    );
  } else {
    const feePayerAccount = await createAccount(feePayerSecret);
    const mintAuthorityAccount = await createAccount(mintAuthoritySecret);

    const createAccIx = SystemProgram.createAccount({
      fromPubkey: feePayerAccount.publicKey,
      newAccountPubkey: faucetAcc.publicKey,
      programId: FAUCET_PROGRAM_ID,
      space: 45,
      lamports: await connection.getMinimumBalanceForRentExemption(
        45,
        COMMITMENT
      )
    });

    const transferAuthorityIx = Token.createSetAuthorityInstruction(
      TOKEN_PROGRAM_ID,
      tokenMintPublicKey,
      (await getPDA())[0],
      "MintTokens",
      mintAuthorityAccount.publicKey,
      //@ts-expect-error
      []
    );

    const tx = new Transaction();
    tx.add(createAccIx, transferAuthorityIx, createFaucetIx);

    await sendAndConfirmTransaction(
      connection,
      tx,
      [feePayerAccount, mintAuthorityAccount, faucetAcc],
      { skipPreflight: false, commitment: COMMITMENT }
    );
  }
  return faucetAcc.publicKey.toBase58();
};
