import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PropsWithChildren } from 'react';

import { UI_MESSAGES } from '../../constants/locationMessages';
import type { User } from '../../types/auth';

type AuthenticatedLayoutProps = PropsWithChildren<{
	user: User;
	onLogout: () => void;
}>;
// @note PropsWithChildren
// 実質的には以下と同じ:
// type AuthenticatedLayoutProps = {
// 	user: User;
// 	onLogout: () => void;
// 	children?: React.ReactNode;		// 子コンポーネント、?は必須ではないことを示す
// };

export default function AuthenticatedLayout({
	children,
	user,
	onLogout,
}: AuthenticatedLayoutProps) {
	return (
		<View style={styles.appContainer}>
			<View style={styles.header}>
				<View>
					<Text style={styles.welcomeText}>{user.username}</Text>
					<Text style={styles.subText}>{user.email}</Text>
				</View>
				<Pressable onPress={onLogout} style={styles.secondaryButton}>
					<Text style={styles.secondaryButtonText}>{UI_MESSAGES.LOGOUT}</Text>
				</Pressable>
			</View>
			<View style={styles.content}>{children}</View>
		</View>
	);
}

const styles = StyleSheet.create({
	appContainer: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	content: {
		flex: 1,
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
	subText: {
		fontSize: 13,
		color: '#5b6473',
		marginTop: 2,
	},
	welcomeText: {
		fontSize: 18,
		fontWeight: '700',
		color: '#14213d',
	},
});
