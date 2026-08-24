import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthenticatedLayout from './src/components/layout/AuthenticatedLayout';
import LoadingScreen from './src/components/layout/LoadingScreen';
import { useAuthSession } from './src/hooks/useAuthSession';
import AuthScreen from './src/screens/AuthScreen';
import MapScreen from './src/screens/MapScreen';
import UserInfoScreen from './src/screens/UserInfoScreen';

type RootStackParamList = {
	Map: undefined;
	UserInfo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
		handleEdit,
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

	const user = authState.user;

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Map" options={{ headerShown: false }}>
					{({ navigation }) => (
						<AuthenticatedLayout
							user={user}
							onUserScreen={() => navigation.navigate('UserInfo')}
						>
							<MapScreen />
						</AuthenticatedLayout>
					)}
				</Stack.Screen>
				<Stack.Screen name="UserInfo" options={{ title: 'ユーザー情報' }}>
					{() => (
						<UserInfoScreen
							onLogout={handleLogout}
							onEdit={handleEdit}
							errorMessage={authState.errorMessage}
							isSubmitting={authState.isSubmitting}
							user={user}
						/>
					)}
				</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
