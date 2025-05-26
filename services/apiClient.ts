import { AuthenticationError } from '@/errors/AuthenticationError';
import { NetworkError } from '@/errors/NetworkError';
import {
  LoginRequest,
  SessionInfo,
  UserInfo
} from '@/models/auth';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

class AuthStorage {
  // Store keys
  static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  static readonly ACCESS_TOKEN_KEY = 'access_token';
  static readonly ACCESS_EXPIRES_AT_KEY = 'access_token_expires_at';

  // Constants
  static getAuthData = async () => {
    const [refreshToken, accessToken, expiresAt] = await Promise.all([
      SecureStore.getItemAsync(AuthStorage.REFRESH_TOKEN_KEY),
      SecureStore.getItemAsync(AuthStorage.ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(AuthStorage.ACCESS_EXPIRES_AT_KEY)
    ])
    if (refreshToken == null) {
      return null
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return {
      refreshToken,
      accessToken,
      isTokenValid: !!expiresAt && parseInt(expiresAt) > nowInSeconds,
    }
  }

  static clearAccessTokens = async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(AuthStorage.REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(AuthStorage.ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(AuthStorage.ACCESS_EXPIRES_AT_KEY)
    ])
  };

  static setAuthData = async (sessionInfo: SessionInfo) => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const expiresAt = nowInSeconds + sessionInfo.expires_in;

    await Promise.all([
      SecureStore.setItemAsync(AuthStorage.REFRESH_TOKEN_KEY, sessionInfo.refresh_token),
      SecureStore.setItemAsync(AuthStorage.ACCESS_TOKEN_KEY, sessionInfo.access_token),
      SecureStore.setItemAsync(AuthStorage.ACCESS_EXPIRES_AT_KEY, expiresAt.toString())
    ])
  }
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  static readonly TOKEN_EXPIRATION_TOLERANCE = 5;
  static readonly BASE_URL = 'http://192.168.0.106:8080';
  static readonly TIMEOUT_MS = 10_000;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: ApiClient.BASE_URL,
      timeout: ApiClient.TIMEOUT_MS,
    });
  }

  private async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.code == "ERR_NETWORK") {
          throw new NetworkError(e);
        } else if (e.status == 401) {
          throw new AuthenticationError("", e);
        }
      }
      throw e;
    }
  }

  private async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.code == "ERR_NETWORK") {
          throw new NetworkError(e);
        } else if (e.status == 401) {
          throw new AuthenticationError("", e);
        }
      }
      throw e;
    }
  }

  private async tokenRefresh(refreshToken: string): Promise<SessionInfo> {
    return this.post<SessionInfo>("/auth/refresh", { refresh_token: refreshToken });
  }

  private async getAccessToken(): Promise<string | null> {
    try {
      const authData = await AuthStorage.getAuthData()
      if (!authData) {
        return null
      }
      if (authData.isTokenValid) {
        return authData.accessToken
      }
      const sessionInfo = await this.tokenRefresh(authData.refreshToken);
      await AuthStorage.setAuthData(sessionInfo);
      return sessionInfo.access_token;
    } catch (e) {
      console.debug(e);
      return null;
    }
  }

  public async login(request: LoginRequest): Promise<void> {
    const sessionInfo = await this.post<SessionInfo>("/auth/login", request);
    await AuthStorage.setAuthData(sessionInfo);
  }

  public async logout(): Promise<void> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      throw new AuthenticationError("No access token available for logout");
    }
    await this.post("/auth/logout", { access_token: accessToken });
  }

  public async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }

  // Introspect token
  public async getUserInfo(): Promise<UserInfo> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      throw new AuthenticationError("User is not authenticated");
    }
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    return await this.get<UserInfo>("/auth/user", config);
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();