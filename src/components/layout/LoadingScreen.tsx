import { ActivityIndicator, Text, View } from 'react-native';

import { UI_MESSAGES } from '../../constants/locationMessages';
import { loadingScreenStyles as styles } from '../../styles/style';

export default function LoadingScreen() {
	return (
		<View style={styles.centerContainer}>
			<ActivityIndicator size="large" />
			<Text style={styles.statusText}>{UI_MESSAGES.CHECKING_LOGIN_STATUS}</Text>
		</View>
	);
}
