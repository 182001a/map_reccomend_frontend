import { apiClient } from './client';
import { createApiRequestError } from './errors';
import { UI_MESSAGES } from '../constants/locationMessages';

// ユーザーデータの型定義
export type User = {
	id: number;
	username: string;
	email: string;
};

// ログイン情報
export type LoginCredentials = {
	username: string;
	password: string;
};

// ログインレスポンスの型定義
export type LoginResponse = {
	user: User;
	token: string;
};

// エンドポイントの定義
const AUTH_ENDPOINTS = {
	login: '/auth/login/',
	profile: '/auth/me/',
	register: '/auth/register/',
} as const;

// ヘッダーの作成
function createTokenHeaders(token: string) {
	return {
		Authorization: `Token ${token}`,
	};
}

// ユーザー登録の実行
export async function register(
	username: string,
	email: string,
	password: string
): Promise<LoginResponse> {
	try {
		// APIリクエストの実行
		// 登録に成功した場合、ユーザーとトークンを含むレスポンスが返されることを想定
		const response = await apiClient.post<LoginResponse>(
			AUTH_ENDPOINTS.register,
			{
				username,
				email,
				password
			}
		);
		return response.data;
	} catch (error: unknown) {
		throw createApiRequestError(error, UI_MESSAGES.REGISTER_FAILED);
	}
}

// ログインリクエストの実行
async function executeLoginRequest(
	credentials: LoginCredentials
): Promise<LoginResponse> {
	const response = await apiClient.post<LoginResponse>(
		AUTH_ENDPOINTS.login,
		credentials
	);

	return response.data;
}

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    return await executeLoginRequest({
      username,
      password,
    });
  } catch (error: unknown) {
    throw createApiRequestError(error, UI_MESSAGES.LOGIN_FAILED);
  }
}

export async function getProfile(token: string): Promise<User> {
	try {
		const response = await apiClient.get<User>(AUTH_ENDPOINTS.profile, {
			headers: {
				...createTokenHeaders(token),
			},
		});

		return response.data;
	} catch (error: unknown) {
		throw createApiRequestError(error, UI_MESSAGES.PROFILE_FETCH_FAILED);
	}
}
