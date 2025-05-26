export interface SessionInfo {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    scope: string;
    session_state: string;
}

export interface UserInfo {
    username: string;
    email: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LogoutRequest {
    access_token: string;
}


export interface RefreshTokenRequest {
    refresh_token: string;
}