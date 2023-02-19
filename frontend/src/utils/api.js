import axios from "axios";
import {store} from "../app/store";
import { authenticateWithPublicKey } from "../features/User/userSlice";
import config from "../config.json"
import { toast } from "react-toastify";
const api = axios.create({
    baseURL:
        process.env.NODE_ENV === "development"
            ? null
            : config.backend,
    withCredentials: true,
});

api.interceptors.response.use(
    async function (response) {
        return response
    },
    (error) => {
        if (error.name === "AxiosError" && error.response.status === 401) {
            toast.info("Please verify your identity to continue")
            store.dispatch(authenticateWithPublicKey(store.getState().user.publicKey))
        }
        return Promise.reject(error);
    }
);

export default api;