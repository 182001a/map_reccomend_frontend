import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PropsWithChildren } from 'react';

import type { User } from '../../types/auth';

type AuthenticatedLayoutProps = PropsWithChildren<{
	user: User;
	onUserScreen?: () => void;
}>;
// @note PropsWithChildren
// 実質的には以下と同じ:
// type AuthenticatedLayoutProps = {
// 	user: User;
// 	children?: React.ReactNode;		// 子コンポーネント、?は必須ではないことを示す
// };

export default function AuthenticatedLayout({
	children,
	user,
	onUserScreen,
}: AuthenticatedLayoutProps) {
	return (
		<View style={styles.appContainer}>
			<View style={styles.header}>
				<Pressable
					onPress={onUserScreen}
					style={styles.userIconButton}
				>
					<Ionicons name="person" size={24} color="#1f4aa8" />
				</Pressable>
				<Pressable
					onPress={() => {}}
					style={styles.secondaryButton}
				>
					<Ionicons name="menu" size={24} color="#1f4aa8" />
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
