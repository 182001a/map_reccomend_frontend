import { StyleSheet } from 'react-native';

/**
 * 共通のスタイル定義
 */
const colors = {
	background: '#f3f6fb',
	border: '#d6dbe4',
	danger: '#c53030',
	dangerBackground: '#fff1f1',
	dangerBorder: '#ffd0d0',
	primary: '#1f6feb',
	primaryDark: '#1f4aa8',
	primarySoft: '#eef4ff',
	text: '#14213d',
	textSubtle: '#5b6473',
	white: '#ffffff',
};

const radii = {
	button: 12,
	card: 16,
};

const shadows = {
	card: {
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.08,
		shadowRadius: 20,
		elevation: 4,
	},
	floatingButton: {
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.18,
		shadowRadius: 8,
		elevation: 6,
	},
	section: {
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.06,
		shadowRadius: 18,
		elevation: 3,
	},
};

const centered = {
	flex: 1,
	justifyContent: 'center' as const,
	alignItems: 'center' as const,
};

const buttonBase = {
	minHeight: 48,
	borderRadius: radii.button,
	alignItems: 'center' as const,
	justifyContent: 'center' as const,
};


/**
 * 画面ごとのスタイル定義
 */
export const authScreenStyles = StyleSheet.create({
	authContainer: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 24,
		backgroundColor: colors.background,
	},
	buttonDisabled: {
		opacity: 0.7,
	},
	card: {
		backgroundColor: colors.white,
		borderRadius: radii.card,
		padding: 24,
		gap: 12,
		...shadows.card,
	},
	description: {
		fontSize: 14,
		color: colors.textSubtle,
		marginBottom: 8,
	},
	errorText: {
		color: colors.danger,
		fontSize: 14,
	},
	input: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radii.button,
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 16,
		backgroundColor: '#f9fbfd',
	},
	primaryButton: {
		...buttonBase,
		backgroundColor: colors.primary,
		marginTop: 8,
	},
	primaryButtonText: {
		color: colors.white,
		fontSize: 16,
		fontWeight: '600',
	},
	textButton: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 4,
	},
	textButtonText: {
		color: colors.primary,
		fontSize: 14,
		fontWeight: '600',
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: colors.text,
	},
});

export const authenticatedLayoutStyles = StyleSheet.create({
	appContainer: {
		flex: 1,
		backgroundColor: colors.white,
	},
	content: {
		flex: 1,
	},
	header: {
		paddingTop: 56,
		paddingHorizontal: 16,
		paddingBottom: 12,
		backgroundColor: colors.white,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: colors.border,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	secondaryButton: {
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 10,
		backgroundColor: colors.primarySoft,
	},
	secondaryButtonText: {
		color: colors.primaryDark,
		fontWeight: '600',
	},
	userIconButton: {
		width: 42,
		height: 42,
		borderRadius: 21,
		backgroundColor: colors.primarySoft,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export const loadingScreenStyles = StyleSheet.create({
	centerContainer: {
		...centered,
		backgroundColor: colors.white,
	},
	statusText: {
		marginTop: 12,
		fontSize: 14,
		color: colors.textSubtle,
	},
});

export const mapScreenStyles = StyleSheet.create({
	centerContainer: {
		...centered,
	},
	currentLocationButton: {
		position: 'absolute',
		right: 16,
		bottom: 24,
		width: 52,
		height: 52,
		borderRadius: 26,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		...shadows.floatingButton,
	},
	currentLocationButtonDisabled: {
		opacity: 0.8,
	},
	map: {
		flex: 1,
	},
	mapWrapper: {
		flex: 1,
	},
});

export const userInfoScreenStyles = StyleSheet.create({
	avatar: {
		width: 72,
		height: 72,
		borderRadius: 36,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.primary,
	},
	avatarText: {
		color: colors.white,
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
		color: colors.textSubtle,
		fontSize: 13,
		fontWeight: '600',
	},
	editButton: {
		...buttonBase,
		backgroundColor: '#80a8ff',
		borderWidth: 1,
		borderColor: '#3e7bff',
	},
	editButtonText: {
		color: colors.primaryDark,
		fontSize: 16,
		fontWeight: '700',
	},
	logoutButton: {
		...buttonBase,
		backgroundColor: colors.dangerBackground,
		borderWidth: 1,
		borderColor: colors.dangerBorder,
	},
	logoutButtonText: {
		color: colors.danger,
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
		backgroundColor: colors.background,
	},
	section: {
		gap: 16,
		padding: 20,
		borderRadius: radii.card,
		backgroundColor: colors.white,
		...shadows.section,
	},
	sectionTitle: {
		color: colors.text,
		fontSize: 18,
		fontWeight: '700',
	},
	subtitle: {
		color: colors.textSubtle,
		fontSize: 14,
	},
	title: {
		color: colors.text,
		fontSize: 26,
		fontWeight: '700',
	},
	value: {
		color: colors.text,
		fontSize: 17,
		fontWeight: '600',
	},
});
