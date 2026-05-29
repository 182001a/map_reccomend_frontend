import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { UI_MESSAGES } from '../../constants/locationMessages';

export default function LoadingScreen() {
	return (
		<View style={styles.centerContainer}>
			<ActivityIndicator size="large" />
			<Text style={styles.statusText}>{UI_MESSAGES.CHECKING_LOGIN_STATUS}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ffffff',
	},
	statusText: {
		marginTop: 12,
		fontSize: 14,
		color: '#5b6473',
	},
});
