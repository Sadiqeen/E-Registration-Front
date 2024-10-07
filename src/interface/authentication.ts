export interface IUser {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserForm {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface IAuthResponse {
    token : string;
}

export interface IAuthState {
    accessToken: string | null;
    user: IUser | null,
    isLoggedIn: boolean,
}
