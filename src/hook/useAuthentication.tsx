import { authApi } from "@/utils/api";
import { handleError } from "@/utils/helper";
import { useState } from "react";
import { setTokens, setUser } from "@/reducers/authReducer";
import { useDispatch } from "react-redux";
import { IAuthResponse, IUser } from "@/interface/authentication";

const useAuthentication = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);

        const body = {
            email,
            password
        };

        try {
            const { data } = await authApi.post<IAuthResponse>("auth", body);

            dispatch(setTokens({
                accessToken: data.token,
            }));

            await getUser(data.token);
            setLoading(false);

            return true;
        } catch (error: unknown) {
            handleError(error);
        } finally {
            setLoading(false);
        }

        return false;
    };

    const getUser = async (accessToken: string) => {
        try {
            const { data: userData } = await authApi.get<IUser>("profile", {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            });

            dispatch(setUser(userData));
        } catch (error) {
            handleError(error);
        }
    };

    return {
        login,
        loading
    };
};

export default useAuthentication;