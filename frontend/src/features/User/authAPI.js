import api from "../../utils/api";

export async function getNonce(publicKey) {
  let resp = await api.get(`/auth/nonce`, { params: { publicKey } });

  return resp.data.nonce;
}

export async function authenticate(signature, publicKey) {
  let resp = await api.post(`/auth/login`, {
    signature,
    publicKey,
  });

  async function refreshAccessToken() {
    await api.post("/auth/token");
  }

  setInterval(refreshAccessToken, 1000 * 60 * 5);

  return resp.data;
}

export async function refreshAccessToken() {
  let resp = await api.post("/auth/token");

  return resp.data;
}
