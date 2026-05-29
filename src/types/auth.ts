export type User = {
	id: number;
	username: string;
	email: string;
};

export type LoginCredentials = {
	username: string;
	password: string;
};

export type LoginResponse = {
	user: User;
	token: string;
};

export type AuthMode = 'login' | 'register';

export type AuthState = {
	user: User | null;
	token: string | null;
	isInitializing: boolean;
	isSubmitting: boolean;
	errorMessage: string | null;
};
