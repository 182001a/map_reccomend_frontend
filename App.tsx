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
import { getProfile, login, User } from './src/api/auth';
import { UI_MESSAGES } from './src/constants/locationMessages';

const AUTH_TOKEN_STORAGE_KEY = 'auth_token';

type AuthState = {
  user: User | null;
  token: string | null;
  isInitializing: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
};

export default function App() {
  const [username, setUsername] = useState('');
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

  async function handleLogin(): Promise<void> {
    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      setAuthState((currentState) => ({
        ...currentState,
        errorMessage: UI_MESSAGES.EMPTY_CREDENTIALS,
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
    setPassword('');
    Alert.alert(UI_MESSAGES.LOGOUT_SUCCESS);
  }

  if (authState.isInitializing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>{UI_MESSAGES.CHECKING_LOGIN_STATUS}</Text>
      </View>
    );
  }

  if (!authState.user || !authState.token) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.authContainer}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{UI_MESSAGES.LOGIN}</Text>
          <Text style={styles.description}>
            {UI_MESSAGES.MAP_AUTH_REQUIRED}
          </Text>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setUsername}
            placeholder="ユーザー名"
            style={styles.input}
            value={username}
          />
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
            onPress={() => void handleLogin()}
            style={[
              styles.primaryButton,
              authState.isSubmitting && styles.buttonDisabled,
            ]}
          >
            {authState.isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.primaryButtonText}>{UI_MESSAGES.LOGIN}</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

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
