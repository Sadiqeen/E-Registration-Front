import { IUser, IUserForm } from "@/interface/authentication";
import { authApi } from "@/utils/api";
import { handleError } from "@/utils/helper";
import { useState } from "react";

const useUser = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const getUserById = async (id: number): Promise<IUser | undefined> => {
        setLoading(true);

        try {
            const { data: response } = await authApi.get<IUser>(`user/${id}`);

            return response;
        } catch (error: unknown) {
            handleError(error);
        } finally {
            setLoading(false);
        }

        return undefined;
    };

    const createUser = async (body: IUserForm): Promise<boolean> => {
        setLoading(true);

        try {
            await authApi.post<IUser>(`user`, body);
            return true;
        } catch (error: unknown) {
            handleError(error);
        } finally {
            setLoading(false);
        }

        return false;
    };

    const updateUser = async (id: number, body: IUserForm): Promise<boolean> => {
        setLoading(true);

        try {
            await authApi.put<IUser>(`user/${id}`, body);
            return true;
        } catch (error: unknown) {
            handleError(error);
        } finally {
            setLoading(false);
        }

        return false;
    };

    const deleteUser = async (id: number): Promise<boolean> => {
        setLoading(true);

        try {
            await authApi.delete<void>(`user/${id}`);
            return true;
        } catch (error: unknown) {
            handleError(error);
        } finally {
            setLoading(false);
        }

        return false;
    };

    return {
        loading,
        createUser,
        updateUser,
        deleteUser,
        getUserById
    };
};

export default useUser;