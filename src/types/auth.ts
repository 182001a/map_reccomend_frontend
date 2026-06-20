/**
 * 認証関連の型定義を行う
 */

// ユーザー情報
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

// ログインレスポンス
export type LoginResponse = {
	user: User;
	token: string;
};

// 登録情報
export type AuthMode = 'login' | 'register';

// 認証状態
export type AuthState = {
	user: User | null;						// ログインユーザーの情報（ログインしていない場合はnull）
	token: string | null;					// 認証トークン（ログインしていない場合はnull）
	isInitializing: boolean;			// 初期化中かどうか
	isSubmitting: boolean;				// フォーム送信中かどうか
	errorMessage: string | null;	// エラーメッセージ（エラーがない場合はnull）
};
