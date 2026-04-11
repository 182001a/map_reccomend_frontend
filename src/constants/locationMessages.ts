export const UI_MESSAGES = {
  PERMISSION_DENIED: '位置情報の権限が拒否されました',
  FETCH_FAILED: '位置情報の取得に失敗しました',
  LOADING: '現在地を取得しています...',
  NO_LOCATION: '現在地の情報がありません',
  CURRENT_LOCATION: '現在地',

  LOGIN: 'ログイン',
  LOGOUT: 'ログアウト',
  LOGIN_SUCCESS: 'ログインしました',
  LOGOUT_SUCCESS: 'ログアウトしました',
  CHECKING_LOGIN_STATUS: 'ログイン状態を確認しています...',
  LOGIN_FAILED: 'ログインに失敗しました',

  EMPTY_CREDENTIALS: 'ユーザー名とパスワードを入力してください',
  RESTORE_FAILED: '保存されたログイン情報を復元できませんでした',

  PROFILE_FETCH_FAILED: 'プロフィールの取得に失敗しました',

  MAP_AUTH_REQUIRED: '地図機能を使うには認証が必要です',
} as const;