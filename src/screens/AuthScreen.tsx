import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	TextInput,
	View,
} from 'react-native';

import { UI_MESSAGES } from '../constants/locationMessages';
import { authScreenStyles as styles } from '../styles/style';
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
