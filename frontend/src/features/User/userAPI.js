import api from "../../utils/api";

export async function getUserData(publicKey) {
  let resp = await api.get(`/user/publicKey/${publicKey}`);
  return resp.data;
}

export async function verifyUSDC(publicKey) {
  let resp = await api.post(`/user/publicKey/${publicKey}/verify`);
  return resp.data;
}
