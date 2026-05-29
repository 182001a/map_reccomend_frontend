import AuthenticatedLayout from './src/components/layout/AuthenticatedLayout';
import LoadingScreen from './src/components/layout/LoadingScreen';
import { useAuthSession } from './src/hooks/useAuthSession';
import AuthScreen from './src/screens/AuthScreen';
import MapScreen from './src/screens/MapScreen';

export default function App() {
	const {
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
	} = useAuthSession();

	if (authState.isInitializing) {
		return <LoadingScreen />;
	}

	if (!authState.user || !authState.token) {
		return (
			<AuthScreen
				authMode={authMode}
				authState={authState}
				email={email}
				password={password}
				username={username}
				onChangeEmail={setEmail}
				onChangePassword={setPassword}
				onChangeUsername={setUsername}
				onSubmit={() =>
					void (authMode === 'login' ? handleLogin() : handleRegister())
				}
				onSwitchMode={switchAuthMode}
			/>
		);
	}

	return (
		<AuthenticatedLayout
			user={authState.user}
			onLogout={() => void handleLogout()}
		>
			<MapScreen />
		</AuthenticatedLayout>
	);
}
