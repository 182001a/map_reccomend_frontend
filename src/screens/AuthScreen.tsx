import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';

import { UI_MESSAGES } from '../constants/locationMessages';
import type { AuthMode, AuthState } from '../types/auth';

type AuthScreenProps = {
	authMode: AuthMode;
	authState: AuthState;
	email: string;
	password: string;
	username: string;
	onChangeEmail: (value: string) => void;
	onChangePassword: (value: string) => void;
	onChangeUsername: (value: string) => void;
	onSubmit: () => void;
	onSwitchMode: (nextMode: AuthMode) => void;
};

export default function AuthScreen({
	authMode,
	authState,
	email,
	password,
	username,
	onChangeEmail,
	onChangePassword,
	onChangeUsername,
	onSubmit,
	onSwitchMode,
}: AuthScreenProps) {
	const nextAuthMode: AuthMode = authMode === 'login' ? 'register' : 'login';

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			style={styles.authContainer}
		>
			<View style={styles.card}>
				<Text style={styles.title}>
					{authMode === 'login' ? UI_MESSAGES.LOGIN : UI_MESSAGES.REGISTER}
				</Text>
				<Text style={styles.description}>
					{authMode === 'login'
						? UI_MESSAGES.LOGIN_DESCRIPTION
						: UI_MESSAGES.REGISTER_DESCRIPTION}
				</Text>

				<TextInput
					autoCapitalize="none"
					autoCorrect={false}
					onChangeText={onChangeUsername}
					placeholder="ユーザー名"
					style={styles.input}
					value={username}
				/>
				{authMode === 'register' ? (
					<TextInput
						autoCapitalize="none"
						autoCorrect={false}
						keyboardType="email-address"
						onChangeText={onChangeEmail}
						placeholder="メールアドレス"
						style={styles.input}
						value={email}
					/>
				) : null}
				<TextInput
					autoCapitalize="none"
					autoCorrect={false}
					onChangeText={onChangePassword}
					placeholder="パスワード"
					secureTextEntry
					style={styles.input}
					value={password}
				/>

				{authState.errorMessage ? (
					<Text style={styles.errorText}>{authState.errorMessage}</Text>
				) : null}

				<Pressable
					disabled={authState.isSubmitting}
					onPress={onSubmit}
					style={[
						styles.primaryButton,
						authState.isSubmitting && styles.buttonDisabled,
					]}
				>
					{authState.isSubmitting ? (
						<ActivityIndicator color="#ffffff" />
					) : (
						<Text style={styles.primaryButtonText}>
							{authMode === 'login' ? UI_MESSAGES.LOGIN : UI_MESSAGES.REGISTER}
						</Text>
					)}
				</Pressable>

				<Pressable
					disabled={authState.isSubmitting}
					onPress={() => onSwitchMode(nextAuthMode)}
					style={styles.textButton}
				>
					<Text style={styles.textButtonText}>
						{authMode === 'login'
							? UI_MESSAGES.GO_TO_REGISTER
							: UI_MESSAGES.GO_TO_LOGIN}
					</Text>
				</Pressable>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	authContainer: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 24,
		backgroundColor: '#f3f6fb',
	},
	buttonDisabled: {
		opacity: 0.7,
	},
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 24,
		gap: 12,
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.08,
		shadowRadius: 20,
		elevation: 4,
	},
	description: {
		fontSize: 14,
		color: '#5b6473',
		marginBottom: 8,
	},
	errorText: {
		color: '#c53030',
		fontSize: 14,
	},
	input: {
		borderWidth: 1,
		borderColor: '#d6dbe4',
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 16,
		backgroundColor: '#f9fbfd',
	},
	primaryButton: {
		backgroundColor: '#1f6feb',
		borderRadius: 12,
		minHeight: 48,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 8,
	},
	primaryButtonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '600',
	},
	textButton: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 4,
	},
	textButtonText: {
		color: '#1f6feb',
		fontSize: 14,
		fontWeight: '600',
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: '#14213d',
	},
});
