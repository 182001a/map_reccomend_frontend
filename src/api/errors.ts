import axios, { AxiosError } from 'axios';

// APIエラーレスポンスの型定義
type ApiErrorResponse = {
	detail?: string;
	[key: string]: string | string[] | undefined;
};

// APIリクエストエラーを表すカスタムエラークラス
export class ApiRequestError extends Error {
	readonly status: number | null;

	constructor(message: string, status: number | null) {
		super(message);
		this.name = 'ApiRequestError';
		this.status = status;
	}
}

// エラーメッセージの正規化関数
function normalizeErrorEntry(value: string | string[] | undefined): string | null {
	if (Array.isArray(value)) {
		return value.find((entry) => entry.trim().length > 0) ?? null;
	}

	if (typeof value === 'string' && value.trim().length > 0) {
		return value;
	}

	return null;
}

// APIエラーメッセージの抽出関数
// Django REST Frameworkのエラーレスポンス構造を考慮して、detailフィールドを優先的にチェックし、次に他のフィールドを確認する
export function extractApiErrorMessage(
	error: unknown,
	fallbackMessage: string
): string {
	if (axios.isAxiosError(error)) {
		// Axiosエラーからレスポンスデータを取得
		const axiosError = error as AxiosError<ApiErrorResponse>;
		const responseData = axiosError.response?.data;

		if (!responseData) {
			return fallbackMessage;
		}

		const detailMessage = normalizeErrorEntry(responseData.detail);
		if (detailMessage) {
			return detailMessage;
		}

		for (const [field, value] of Object.entries(responseData)) {
			if (field === 'detail') {
				continue;
			}
			const fieldMessage = normalizeErrorEntry(value);
			if (fieldMessage) {
				return `${field}: ${fieldMessage}`;
			}
		}

		return fallbackMessage;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return fallbackMessage;
}

// APIリクエストエラーを作成するユーティリティ関数
export function createApiRequestError(
	error: unknown,
	fallbackMessage: string
): ApiRequestError {
	const status = axios.isAxiosError(error) ? error.response?.status ?? null : null;
	return new ApiRequestError(extractApiErrorMessage(error, fallbackMessage), status);
}
