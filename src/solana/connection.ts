import { Cluster, clusterApiUrl, Connection } from "@solana/web3.js";
import { ref } from "vue";

export const NETWORKS = {
  MAINNET: "mainnet-beta" as Cluster,
  TESTNET: "testnet" as Cluster,
  DEVNET: "devnet" as Cluster
};

export const chosenCluster = ref(NETWORKS.TESTNET);

let connection: Connection;

export const changeCluster = (clusterName: Cluster) => {
  connection = new Connection(clusterApiUrl(clusterName), "singleGossip");
  chosenCluster.value = clusterName;
};

export const getConnection = () => connection;
