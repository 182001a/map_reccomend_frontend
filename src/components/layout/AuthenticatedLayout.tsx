import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PropsWithChildren } from 'react';

import { UI_MESSAGES } from '../../constants/locationMessages';
import type { User } from '../../types/auth';

type AuthenticatedLayoutProps = PropsWithChildren<{
	user: User;
	onLogout: () => void;
	onUserScreen?: () => void;
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
	onUserScreen,
}: AuthenticatedLayoutProps) {
	return (
		<View style={styles.appContainer}>
			<View style={styles.header}>
				<Pressable
					onPress={onUserScreen}
					style={styles.userIconButton}
					accessibilityLabel="ユーザー画面を開く"
				>
					<Ionicons name="person" size={24} color="#1f4aa8" />
				</Pressable>
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
	userIconButton: {
		width: 42,
		height: 42,
		borderRadius: 21,
		backgroundColor: '#eef4ff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
