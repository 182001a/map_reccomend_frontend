import axios, { AxiosError } from 'axios';

type ApiErrorResponse = {
	detail?: string;
};

// APIエラーメッセージの抽出関数
export function extractApiErrorMessage(
	error: unknown,
	fallbackMessage: string
): string {
	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosError<ApiErrorResponse>;
		return axiosError.response?.data?.detail ?? fallbackMessage;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return fallbackMessage;
}
