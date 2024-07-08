import axios from '../axios/Axios'
import useAuth from "./useAuth";
import { refreshTokenURL } from '../constants/Constants';

export default function useRefreshToken() {
    const { setAccessToken, setCSRFToken } = useAuth()

    const refresh = async () => {
        const response = await axios.post(refreshTokenURL)
        setAccessToken(response.data.access)
        setCSRFToken(response.headers["x-csrftoken"])

        return { accessToken: response.data.access, csrfToken: response.headers["x-csrftoken"] }
    }

    return refresh
}