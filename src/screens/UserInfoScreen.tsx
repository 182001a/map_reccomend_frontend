import { Pressable, StyleSheet, Text, View } from 'react-native';

import { UI_MESSAGES } from '../constants/locationMessages';

type UserInfoScreenProps = {
	onLogout: () => Promise<void>;
};

export default function UserInfoScreen({ onLogout }: UserInfoScreenProps) {
	return (
		<View style={styles.container}>
			<Text>ユーザー情報を表示します（実装中）</Text>
			<Pressable
				onPress={() => void onLogout()}
				style={styles.logoutButton}
			>
				<Text style={styles.logoutButtonText}>{UI_MESSAGES.LOGOUT}</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	logoutButton: {
		marginTop: 16,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		backgroundColor: '#f44336',
	},
	logoutButtonText: {
		color: '#ffffff',
		fontWeight: 'bold',
	},
});
