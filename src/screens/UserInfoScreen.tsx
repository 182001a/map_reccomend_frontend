import { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native';

import { UI_MESSAGES } from '../constants/locationMessages';
import { userInfoScreenStyles as styles } from '../styles/style';
import type { User, UserUpdateInput } from '../types/auth';

const PASSWORD_INPUT_SCROLL_Y = 160;

type UserInfoScreenProps = {
	onLogout: () => Promise<void>;	// ログアウトボタンを押したときに実行する処理
	onEdit: (input: UserUpdateInput) => Promise<boolean>;	// 編集内容を保存する処理
	errorMessage: string | null;		// 編集エラーの表示内容
	isSubmitting: boolean;			// 編集内容の送信中かどうか
	user: User;										// 画面に表示するログイン中のユーザー情報
};

// ログイン中ユーザーのプロフィール情報を表示する画面
export default function UserInfoScreen({
	onLogout,
	onEdit,
	errorMessage,
	isSubmitting,
	user,
}: UserInfoScreenProps) {
	const scrollViewRef = useRef<ScrollView | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editingUsername, setEditingUsername] = useState(user.username);
	const [editingPassword, setEditingPassword] = useState('');
	const [hasSubmittedEdit, setHasSubmittedEdit] = useState(false);
	const profileInitial = user.username.slice(0, 1).toUpperCase();	// アバターに表示するユーザー名の頭文字

	useEffect(() => {
		if (!isEditing) {
			setEditingUsername(user.username);
			setEditingPassword('');
		}
	}, [isEditing, user.username]);

	function cancelEdit(): void {
		setEditingUsername(user.username);
		setEditingPassword('');
		setHasSubmittedEdit(false);
		setIsEditing(false);
	}

	async function saveEdit(): Promise<void> {
		setHasSubmittedEdit(true);
		const isSaved = await onEdit({
			username: editingUsername,
			...(editingPassword ? { password: editingPassword } : {}),
		});

		if (isSaved) {
			setEditingPassword('');
			setHasSubmittedEdit(false);
			setIsEditing(false);
		}
	}

	function scrollToPasswordInput(): void {
		setTimeout(() => {
			scrollViewRef.current?.scrollTo({
				y: PASSWORD_INPUT_SCROLL_Y,
				animated: true,
			});
		}, 120);
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
			style={styles.keyboardAvoidingContainer}
		>
			<ScrollView
				automaticallyAdjustKeyboardInsets
				contentContainerStyle={[
					styles.content,
					isEditing && styles.editingContent,
				]}
				keyboardDismissMode="interactive"
				keyboardShouldPersistTaps="handled"
				ref={scrollViewRef}
				style={styles.screen}
			>
				<View style={styles.profileHeader}>
					<View style={styles.avatar}>
						<Text style={styles.avatarText}>{profileInitial}</Text>
					</View>
					<Text style={styles.title}>プロフィール</Text>
					<Text style={styles.subtitle}>アカウント情報の確認</Text>
				</View>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>ユーザー情報</Text>
					{isEditing ? (
						<>
							<View style={styles.fieldGroup}>
								<Text style={styles.label}>ユーザー名</Text>
								<TextInput
									autoCapitalize="none"
									autoCorrect={false}
									editable={!isSubmitting}
									onChangeText={setEditingUsername}
									style={styles.input}
									value={editingUsername}
								/>
							</View>
							<View style={styles.fieldGroup}>
								<Text style={styles.label}>メールアドレス</Text>
								<Text style={styles.value}>{user.email}</Text>
							</View>
							<View style={styles.fieldGroup}>
								<Text style={styles.label}>パスワード</Text>
								<TextInput
									autoCapitalize="none"
									autoCorrect={false}
									editable={!isSubmitting}
									onChangeText={setEditingPassword}
									onFocus={scrollToPasswordInput}
									placeholder="変更する場合のみ入力"
									secureTextEntry
									style={styles.input}
									value={editingPassword}
								/>
							</View>
							{hasSubmittedEdit && errorMessage ? (
								<Text style={styles.errorText}>{errorMessage}</Text>
							) : null}
						</>
					) : (
						<>
							<View style={styles.fieldGroup}>
								<Text style={styles.label}>ユーザー名</Text>
								<Text style={styles.value}>{user.username}</Text>
							</View>
							<View style={styles.fieldGroup}>
								<Text style={styles.label}>メールアドレス</Text>
								<Text style={styles.value}>{user.email}</Text>
							</View>
						</>
					)}
				</View>
				{isEditing ? (
					<View style={styles.buttonRow}>
						<Pressable
							disabled={isSubmitting}
							onPress={cancelEdit}
							style={[
								styles.cancelButton,
								styles.buttonRowItem,
							]}
						>
							<Text style={styles.cancelButtonText}>{UI_MESSAGES.CANCEL}</Text>
						</Pressable>
						<Pressable
							disabled={isSubmitting}
							onPress={() => void saveEdit()}
							style={[
								styles.editButton,
								styles.buttonRowItem,
								isSubmitting && styles.buttonDisabled,
							]}
						>
							{isSubmitting ? (
								<ActivityIndicator color="#ffffff" />
							) : (
								<Text style={styles.editButtonText}>{UI_MESSAGES.SAVE}</Text>
							)}
						</Pressable>
					</View>
				) : (
					<Pressable
						onPress={() => {
							setHasSubmittedEdit(false);
							setIsEditing(true);
						}}
						style={styles.editButton}
					>
						<Text style={styles.editButtonText}>{UI_MESSAGES.EDIT}</Text>
					</Pressable>
				)}
				{/* ログアウトボタン */}
				<Pressable
					disabled={isSubmitting}
					onPress={() => void onLogout()}
					style={[
						styles.logoutButton,
						isSubmitting && styles.buttonDisabled,
					]}
				>
					<Text style={styles.logoutButtonText}>{UI_MESSAGES.LOGOUT}</Text>
				</Pressable>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
