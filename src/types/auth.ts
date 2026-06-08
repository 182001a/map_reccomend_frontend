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
	user: User | null;						// ログインユーザーの情報（ログインしていない場合はnull）
	token: string | null;					// 認証トークン（ログインしていない場合はnull）
	isInitializing: boolean;			// 初期化中かどうか
	isSubmitting: boolean;				// フォーム送信中かどうか
	errorMessage: string | null;	// エラーメッセージ（エラーがない場合はnull）
};
