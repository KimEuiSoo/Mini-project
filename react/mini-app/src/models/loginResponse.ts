export interface loginResponse {
    access_token: string;
}

export const EmptyLogin: loginResponse = {
    access_token: ''
}

export interface UserResponse {
    id: number;
    email: string;
    name: string;
}