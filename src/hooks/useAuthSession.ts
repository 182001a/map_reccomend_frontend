import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { getProfile, login, register } from '../dao/auth';
import { ApiRequestError } from '../dao/errors';
import { UI_MESSAGES } from '../constants/locationMessages';
import type { AuthMode, AuthState } from '../types/auth';

const AUTH_TOKEN_STORAGE_KEY = 'auth_token';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[A-Za-z0-9_]+$/;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;

type UseAuthSessionResult = {
	authMode: AuthMode;
	authState: AuthState;
	email: string;
	password: string;
	username: string;
	handleLogin: () => Promise<void>;
	handleLogout: () => Promise<void>;
	handleRegister: () => Promise<void>;
	setEmail: (value: string) => void;
	setPassword: (value: string) => void;
	setUsername: (value: string) => void;
	switchAuthMode: (nextMode: AuthMode) => void;
};

export function useAuthSession(): UseAuthSessionResult {
	const [authMode, setAuthMode] = useState<AuthMode>('login');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		token: null,
		isInitializing: true,
		isSubmitting: false,
		errorMessage: null,
	});

	useEffect(() => {
		void restoreSession();
	}, []);

	async function restoreSession(): Promise<void> {
		try {
			const storedToken = await SecureStore.getItemAsync(AUTH_TOKEN_STORAGE_KEY);

			if (!storedToken) {
				setAuthState((currentState) => ({
					// @note
					// 現在のauthStateを保持しつつ、isInitializingのみをfalseに更新するための記法
					...currentState,
					isInitializing: false,
				}));
				return;
			}

			const user = await getProfile(storedToken);
			setAuthState({
				user,
				token: storedToken,
				isInitializing: false,
				isSubmitting: false,
				errorMessage: null,
			});
		} catch (error) {
			const isInvalidToken =
				error instanceof ApiRequestError &&
				(error.status === 401 || error.status === 403);

			if (isInvalidToken) {
				await SecureStore.deleteItemAsync(AUTH_TOKEN_STORAGE_KEY);
			}

			setAuthState({
				user: null,
				token: null,
				isInitializing: false,
				isSubmitting: false,
				errorMessage: isInvalidToken
					? UI_MESSAGES.PROFILE_FETCH_FAILED
					: UI_MESSAGES.RESTORE_FAILED,
			});
		}
	}

	function validateAuthForm(currentMode: AuthMode): string | null {
		const trimmedUsername = username.trim();
		const trimmedEmail = email.trim();

		if (currentMode === 'login') {
			if (!trimmedUsername || !password) {
				return UI_MESSAGES.EMPTY_CREDENTIALS;
			}
			return null;
		}

		if (!trimmedUsername || !trimmedEmail || !password) {
			return UI_MESSAGES.EMPTY_REGISTRATION_FIELDS;
		}

		if (
			trimmedUsername.length < USERNAME_MIN_LENGTH ||
			trimmedUsername.length > USERNAME_MAX_LENGTH
		) {
			return UI_MESSAGES.INVALID_USERNAME_LENGTH;
		}

		if (!USERNAME_REGEX.test(trimmedUsername)) {
			return UI_MESSAGES.INVALID_USERNAME_FORMAT;
		}

		if (!EMAIL_REGEX.test(trimmedEmail)) {
			return UI_MESSAGES.INVALID_EMAIL;
		}

		if (
			password.length < PASSWORD_MIN_LENGTH ||
			password.length > PASSWORD_MAX_LENGTH
		) {
			return UI_MESSAGES.INVALID_PASSWORD_LENGTH;
		}

		return null;
	}

	async function handleLogin(): Promise<void> {
		const trimmedUsername = username.trim();
		const validationError = validateAuthForm('login');

		if (validationError) {
			setAuthState((currentState) => ({
				...currentState,
				errorMessage: validationError,
			}));
			return;
		}

		try {
			setAuthState((currentState) => ({
				...currentState,
				isSubmitting: true,
				errorMessage: null,
			}));

			const response = await login(trimmedUsername, password);
			await SecureStore.setItemAsync(AUTH_TOKEN_STORAGE_KEY, response.token);
			setAuthState({
				user: response.user,
				token: response.token,
				isInitializing: false,
				isSubmitting: false,
				errorMessage: null,
			});
			setPassword('');
		} catch (error) {
			setAuthState((currentState) => ({
				...currentState,
				isSubmitting: false,
				errorMessage:
					error instanceof Error ? error.message : UI_MESSAGES.LOGIN_FAILED,
			}));
		}
	}

	async function handleRegister(): Promise<void> {
		const trimmedUsername = username.trim();
		const trimmedEmail = email.trim();
		const validationError = validateAuthForm('register');

		if (validationError) {
			setAuthState((currentState) => ({
				...currentState,
				errorMessage: validationError,
			}));
			return;
		}

		try {
			setAuthState((currentState) => ({
				...currentState,
				isSubmitting: true,
				errorMessage: null,
			}));

			await register(trimmedUsername, trimmedEmail, password);
			setAuthState((currentState) => ({
				...currentState,
				isSubmitting: false,
				errorMessage: null,
			}));
			setAuthMode('login');
			setUsername(trimmedUsername);
			setEmail('');
			setPassword('');
			Alert.alert(UI_MESSAGES.REGISTER_SUCCESS);
		} catch (error) {
			setAuthState((currentState) => ({
				...currentState,
				isSubmitting: false,
				errorMessage:
					error instanceof Error ? error.message : UI_MESSAGES.REGISTER_FAILED,
			}));
		}
	}

	async function handleLogout(): Promise<void> {
		await SecureStore.deleteItemAsync(AUTH_TOKEN_STORAGE_KEY);
		setAuthState({
			user: null,
			token: null,
			isInitializing: false,
			isSubmitting: false,
			errorMessage: null,
		});
		setUsername('');
		setEmail('');
		setPassword('');
		Alert.alert(UI_MESSAGES.LOGOUT_SUCCESS);
	}

	function switchAuthMode(nextMode: AuthMode): void {
		setAuthMode(nextMode);
		setEmail('');
		setPassword('');
		setAuthState((currentState) => ({
			...currentState,
			errorMessage: null,
			isSubmitting: false,
		}));
	}

	return {
		authMode,
		authState,
		email,
		password,
		username,
		handleLogin,
		handleLogout,
		handleRegister,
		setEmail,
		setPassword,
		setUsername,
		switchAuthMode,
	};
}
