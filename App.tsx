import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

import MapScreen from './src/screens/MapScreen';
import { getProfile, login, register, User } from './src/api/auth';
import { UI_MESSAGES } from './src/constants/locationMessages';

const AUTH_TOKEN_STORAGE_KEY = 'auth_token';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[A-Za-z0-9_]+$/;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;

// 認証状態の型定義
type AuthState = {
  user: User | null;						// ログインしているユーザーの情報
  token: string | null;					// 認証トークン		
  isInitializing: boolean;			// アプリ起動時にセッションを復元中かどうか
  isSubmitting: boolean;				// ログインや登録のリクエストを送信中かどうか
  errorMessage: string | null;	// エラーメッセージ（バリデーションエラーやAPIエラーなど）
};

// 認証モードの型定義
type AuthMode = 'login' | 'register';

// アプリのメインコンポーネント
export default function App() {
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

  // セッションの復元
  async function restoreSession(): Promise<void> {
    try {
      const storedToken = await SecureStore.getItemAsync(AUTH_TOKEN_STORAGE_KEY);

      if (!storedToken) {
				// トークンが保存されていない場合は初期化
        setAuthState((currentState) => ({
          ...currentState,
          isInitializing: false,
        }));
        return;
      }

			// トークンが保存されている場合はプロフィールを取得してセッションを復元
      const user = await getProfile(storedToken);
      setAuthState({
        user,
        token: storedToken,
        isInitializing: false,
        isSubmitting: false,
        errorMessage: null,
      });
    } catch {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_STORAGE_KEY);
      setAuthState({
        user: null,
        token: null,
        isInitializing: false,
        isSubmitting: false,
        errorMessage: UI_MESSAGES.PROFILE_FETCH_FAILED,
      });
    }
  }

	// 認証フォームのバリデーション
	// エラーメッセージを返す
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

  // ログイン処理
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

	// ユーザー登録処理
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

  // ログアウト処理
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

  if (authState.isInitializing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>{UI_MESSAGES.CHECKING_LOGIN_STATUS}</Text>
      </View>
    );
  }

  /* ==================== UIレンダリング ==================== */

  // ログインしていない場合は認証フォームを表示
  if (!authState.user || !authState.token) {
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
            onChangeText={setUsername}
            placeholder="ユーザー名"
            style={styles.input}
            value={username}
          />
          {authMode === 'register' ? (
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="メールアドレス"
              style={styles.input}
              value={email}
            />
          ) : null}
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setPassword}
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
            onPress={() =>
              void (authMode === 'login' ? handleLogin() : handleRegister())
            }
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
            onPress={() =>
              switchAuthMode(authMode === 'login' ? 'register' : 'login')
            }
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

  // ログインしている場合は地図画面を表示
  return (
    <View style={styles.appContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>{authState.user.username}</Text>
          <Text style={styles.subText}>{authState.user.email}</Text>
        </View>
        <Pressable onPress={() => void handleLogout()} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>{UI_MESSAGES.LOGOUT}</Text>
        </Pressable>
      </View>
      <View style={styles.mapContainer}>
        <MapScreen />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
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
  header: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d6dbe4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  mapContainer: {
    flex: 1,
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
  secondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#eef4ff',
  },
  secondaryButtonText: {
    color: '#1f4aa8',
    fontWeight: '600',
  },
  statusText: {
    marginTop: 12,
    fontSize: 14,
    color: '#5b6473',
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
  subText: {
    fontSize: 13,
    color: '#5b6473',
    marginTop: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#14213d',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#14213d',
  },
});
