import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
import * as AuthService from "./authAPI";
import detectEthereumProvider from "@metamask/detect-provider";
import { getUserData, verifyUSDC } from "./userAPI";
import {toast} from "react-toastify"
export const initialize = createAsyncThunk(
  "auth/initialize",
  async (_, thunkAPI) => {
    const provider = await detectEthereumProvider();
    if (provider) {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      thunkAPI.dispatch(setPublicKey(accounts[0]))
      const userData = await getUserData(accounts[0])
      thunkAPI.dispatch(setCoupon(userData.user.coupon))
      console.log("userData", userData)
    } else {
      window.alert("Please install MetaMask to use this application!");
    }

    provider.on("accountsChanged", async (accounts) => {
      window.location.reload()
    });
  }
);

export const authenticateWithPublicKey = createAsyncThunk(
  "auth/authenticate",
  async (walletAddress, thunkAPI) => {
    try {
      let nonce = await AuthService.getNonce(walletAddress);

      const message = `This is proof to Sesame that I own the wallet ${walletAddress} with random nonce ${nonce}`;
      console.log("authenticating")
      const signedMessage = await window.ethereum.request({
        method: "personal_sign",
        params: [message, walletAddress],
      });
      console.log("signed", signedMessage);
      await AuthService.authenticate(signedMessage, walletAddress);
    } catch (error) {
      if (error.code === 4001) {
        // user cancelled Metamask login
        return;
      }

      toast.error("Sorry, an unknown error has occured, please try again later")
    }
  }
);

export const checkUSDCOwnership = createAsyncThunk(
  "user/checkUSDCOwnership",
  async (walletAddress, thunkAPI) => {
    let {owns_usdc, coupon} = await verifyUSDC(walletAddress);
    console.log({owns_usdc, coupon})
    if (owns_usdc) {
      thunkAPI.dispatch(setCoupon(coupon))
    } else {
      toast.info("You do not own any USDC, please purchase some to earn rewards")
    }
  }
)

const initialState = {
  publicKey: null,
  coupon: null,
  checkingUSDCOwnership: false
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setPublicKey: (state, action) => {
      state.publicKey = action.payload;
    },
    setCoupon: (state, action) => {
      state.coupon = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(checkUSDCOwnership.pending, (state, action) => {
      state.checkingUSDCOwnership = true
    })

    builder.addCase(checkUSDCOwnership.fulfilled, (state, action) => {
      state.checkingUSDCOwnership = false 
    })

    builder.addCase(checkUSDCOwnership.rejected, (state, action) => {
      toast.error("Sorry, we ran into an issue verifying your USDC ownership, please try again later")
      state.checkingUSDCOwnership = false 
    })
  }
});

export const { setPublicKey, setVerifiedTokens, setCoupon } = authSlice.actions;

export default authSlice.reducer;
