import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { UI_MESSAGES } from '../constants/locationMessages';
import type { User } from '../types/auth';

type UserInfoScreenProps = {
	onLogout: () => Promise<void>;	// ログアウトボタンを押したときに実行する処理
	user: User;										// 画面に表示するログイン中のユーザー情報
};

// ログイン中ユーザーのプロフィール情報を表示する画面
export default function UserInfoScreen({
	onLogout,
	user,
}: UserInfoScreenProps) {
	const profileInitial = user.username.slice(0, 1).toUpperCase();	// アバターに表示するユーザー名の頭文字

	return (
		<ScrollView contentContainerStyle={styles.content} style={styles.screen}>
			<View style={styles.profileHeader}>
				<View style={styles.avatar}>
					<Text style={styles.avatarText}>{profileInitial}</Text>
				</View>
				<Text style={styles.title}>プロフィール</Text>
				<Text style={styles.subtitle}>アカウント情報の確認</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>ユーザー情報</Text>

				<View style={styles.fieldGroup}>
					<Text style={styles.label}>ユーザー名</Text>
					<Text style={styles.value}>{user.username}</Text>
				</View>

				<View style={styles.fieldGroup}>
					<Text style={styles.label}>メールアドレス</Text>
					<Text style={styles.value}>{user.email}</Text>
				</View>
			</View>

			<Pressable
				onPress={() => void onLogout()}
				style={styles.logoutButton}
			>
				<Text style={styles.logoutButtonText}>{UI_MESSAGES.LOGOUT}</Text>
			</Pressable>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	avatar: {
		width: 72,
		height: 72,
		borderRadius: 36,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#1f6feb',
	},
	avatarText: {
		color: '#ffffff',
		fontSize: 30,
		fontWeight: '700',
	},
	content: {
		padding: 24,
		gap: 24,
	},
	fieldGroup: {
		gap: 8,
	},
	label: {
		color: '#5b6473',
		fontSize: 13,
		fontWeight: '600',
	},
	logoutButton: {
		minHeight: 48,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff1f1',
		borderWidth: 1,
		borderColor: '#ffd0d0',
	},
	logoutButtonText: {
		color: '#c53030',
		fontSize: 16,
		fontWeight: '700',
	},
	profileHeader: {
		alignItems: 'center',
		gap: 8,
		paddingTop: 16,
	},
	screen: {
		flex: 1,
		backgroundColor: '#f3f6fb',
	},
	section: {
		gap: 16,
		padding: 20,
		borderRadius: 16,
		backgroundColor: '#ffffff',
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.06,
		shadowRadius: 18,
		elevation: 3,
	},
	sectionTitle: {
		color: '#14213d',
		fontSize: 18,
		fontWeight: '700',
	},
	subtitle: {
		color: '#5b6473',
		fontSize: 14,
	},
	title: {
		color: '#14213d',
		fontSize: 26,
		fontWeight: '700',
	},
	value: {
		color: '#14213d',
		fontSize: 17,
		fontWeight: '600',
	},
});
