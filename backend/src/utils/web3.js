import Web3 from "web3";
import config from "config";
const web3 = new Web3(config.get("web3.provider"));

export default web3;

/**
 * 
 * @param {string} walletAddress 
 * @returns True if the wallet has USDC, false otherwise
 */
export async function checkUSDCBalance(walletAddress) {
  const contract = new web3.eth.Contract(
    config.get("usdc.abi"),
    config.get("usdc.address")
  );
  const balance = await contract.methods.balanceOf(walletAddress).call();
  return balance > 0;
}
