import { Pressable, ScrollView, Text, View } from 'react-native';

import { UI_MESSAGES } from '../constants/locationMessages';
import { userInfoScreenStyles as styles } from '../styles/style';
import type { User } from '../types/auth';


type UserInfoScreenProps = {
	onLogout: () => Promise<void>;	// ログアウトボタンを押したときに実行する処理
	onEdit: () => Promise<void>;		// 編集ボタンを押したときに実行する処理
	user: User;										// 画面に表示するログイン中のユーザー情報
};

// ログイン中ユーザーのプロフィール情報を表示する画面
export default function UserInfoScreen({
	onLogout,
	onEdit,
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
			{/* 編集ボタン */}
			<Pressable
				onPress={() => void onEdit()}
				style={styles.editButton}
			>
				<Text style={styles.editButtonText}>{UI_MESSAGES.EDIT}</Text>
			</Pressable>
			{/* ログアウトボタン */}
			<Pressable
				onPress={() => void onLogout()}
				style={styles.logoutButton}
			>
				<Text style={styles.logoutButtonText}>{UI_MESSAGES.LOGOUT}</Text>
			</Pressable>
		</ScrollView>
	);
}
