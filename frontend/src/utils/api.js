import axios from "axios";
import {store} from "../app/store";
import { authenticateWithPublicKey } from "../features/User/userSlice";
const api = axios.create({
    baseURL:
        process.env.NODE_ENV === "development"
            ? null
            : "https://us-central1-decent-destiny-329402.cloudfunctions.net/api/",
    withCredentials: true,
});

api.interceptors.response.use(
    async function (response) {
        return response
    },
    (error) => {
        console.log(error)
        if (error.name === "AxiosError" && error.response.status === 401) {
            console.log("401")
            window.alert("Please verify your identity to continue");
            store.dispatch(authenticateWithPublicKey(store.getState().user.publicKey))
        }
        return Promise.reject(error);
    }
);

export default api;