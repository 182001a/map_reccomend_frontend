import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import type { PropsWithChildren } from 'react';

import { authenticatedLayoutStyles as styles } from '../../styles/style';
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
