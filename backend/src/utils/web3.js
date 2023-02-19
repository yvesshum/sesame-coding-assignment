import Web3 from "web3";
import config from "config"
const web3 = new Web3(process.env.RPC_URL ?? "https://rpc.ankr.com/eth");

export default web3;

export async function checkUSDCBalance(walletAddress) {
  const contract = new web3.eth.Contract(config.get("usdc.abi"), config.get("usdc.address"));
  const balance = await contract.methods.balanceOf(walletAddress).call();
  return balance > 0;
}
