import { Cluster, clusterApiUrl, Connection } from "@solana/web3.js";
import { ref } from "vue";

type Localnet = "localnet";

export const CLUSTERS = {
  MAINNET: "mainnet-beta" as Cluster,
  TESTNET: "testnet" as Cluster,
  DEVNET: "devnet" as Cluster,
  LOCALNET: "localnet" as Localnet
};

export const chosenCluster = ref<Cluster | Localnet>(CLUSTERS.TESTNET);

let connection: Connection;

export const changeCluster = (clusterName: Cluster | Localnet) => {
  connection = new Connection(
    clusterName === CLUSTERS.LOCALNET
      ? "http://localhost:8899"
      : clusterApiUrl(clusterName),
    "singleGossip"
  );
  chosenCluster.value = clusterName;
};

export const getConnection = () => connection;
