import { IAuthState, IUser } from '@/interface/authentication';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IAuthState = {
    accessToken: null,
    user: null,
    isLoggedIn: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
        },
        setTokens: (state, action: PayloadAction<{ accessToken: string }>) => {
            state.accessToken = action.payload.accessToken;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.accessToken = null;
            state.user = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setTokens, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
