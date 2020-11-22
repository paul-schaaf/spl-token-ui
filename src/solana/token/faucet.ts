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
import { getMintPubkeyFromTokenAccountPubkey } from "./index";

const FAUCET_PROGRAM_ID = new PublicKey(
  "8LJoSP7NsB8ybpLG1zFnwrzucpgZBCd2H7YJrrgPoss2"
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
    const [feePayerAccount, mintAuthorityAccount] = await Promise.all([
      createAccount(feePayerSecret),
      createAccount(mintAuthoritySecret)
    ]);

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

const buildAirdropTokensIx = async (
  amount: u64,
  adminPubkey: PublicKey | null,
  tokenMintPublicKey: PublicKey,
  destinationAccountPubkey: PublicKey,
  faucetPubkey: PublicKey
) => {
  const pubkeyNonce = await getPDA();

  const keys = [
    { pubkey: pubkeyNonce[0], isSigner: false, isWritable: false },
    {
      pubkey: tokenMintPublicKey,
      isSigner: false,
      isWritable: true
    },
    { pubkey: destinationAccountPubkey, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: faucetPubkey, isSigner: false, isWritable: false }
  ];

  if (adminPubkey) {
    keys.push({
      pubkey: adminPubkey,
      isSigner: true,
      isWritable: false
    });
  }

  return new TransactionInstruction({
    programId: FAUCET_PROGRAM_ID,
    data: Buffer.from([1, ...amount.toArray("le", 8)]),
    keys
  });
};

export const airdropTokens = async (
  feePayerSecret: string,
  feePayerSignsExternally: boolean,
  faucetAddress: string,
  tokenDestinationAddress: string,
  adminSecret: string,
  adminSignsExternally: boolean,
  amount: u64
) => {
  const tokenDestinationPublicKey = new PublicKey(tokenDestinationAddress);
  const faucetPubkey = new PublicKey(faucetAddress);
  const connection = getConnection();
  const tokenMintPubkey = await getMintPubkeyFromTokenAccountPubkey(
    tokenDestinationPublicKey
  );

  if (feePayerSignsExternally || adminSignsExternally) {
    const wallet = await useWallet();

    const adminAccountOrWalletOrNull = adminSignsExternally
      ? wallet
      : adminSecret
      ? await createAccount(adminSecret)
      : null;

    const ix = await buildAirdropTokensIx(
      amount,
      adminAccountOrWalletOrNull ? adminAccountOrWalletOrNull.publicKey : null,
      tokenMintPubkey,
      tokenDestinationPublicKey,
      faucetPubkey
    );

    await sendTxUsingExternalSignature(
      [ix],
      connection,
      feePayerSignsExternally ? null : await createAccount(feePayerSecret),
      adminSignsExternally
        ? []
        : adminAccountOrWalletOrNull
        ? [adminAccountOrWalletOrNull]
        : [],
      wallet
    );
  } else {
    const feePayerAccount = await createAccount(feePayerSecret);

    const adminAccount = adminSecret ? await createAccount(adminSecret) : null;

    const ix = await buildAirdropTokensIx(
      amount,
      adminAccount ? adminAccount.publicKey : null,
      tokenMintPubkey,
      tokenDestinationPublicKey,
      faucetPubkey
    );

    const tx = new Transaction();
    tx.add(ix);

    const signers = [feePayerAccount];
    if (adminAccount) {
      signers.push(adminAccount);
    }
    await sendAndConfirmTransaction(connection, tx, signers, {
      skipPreflight: false,
      commitment: COMMITMENT
    });
  }
  return tokenDestinationPublicKey.toBase58();
};
