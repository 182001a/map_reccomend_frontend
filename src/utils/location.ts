// 位置情報関連のユーティリティ関数をまとめたファイル

import * as Location from 'expo-location';
import type { Region } from 'react-native-maps';

import { UI_MESSAGES } from '../constants/locationMessages';

// 位置情報の参照権限をリクエストする関数
export async function requestLocationPermission(): Promise<Location.PermissionStatus> {
	const permissionResponse = await Location.requestForegroundPermissionsAsync();
	return permissionResponse.status;
}

// 緯度経度からRegionオブジェクトを作成するユーティリティ関数
export function createRegionFromCoordinates(
	latitude: number,
	longitude: number
): Region {
	return {
		latitude,
		longitude,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	};
}

// 現在地を取得してRegionオブジェクトを返す関数
export async function getCurrentRegion(): Promise<Region> {
	const permissionStatus = await requestLocationPermission();
	if (permissionStatus !== Location.PermissionStatus.GRANTED) {
		// 権限が拒否された場合はエラー
		throw new Error(UI_MESSAGES.PERMISSION_DENIED);
	}

	// 現在地を取得
	const currentPosition = await Location.getCurrentPositionAsync({});
	// Regionオブジェクトを作成
	return createRegionFromCoordinates(
		currentPosition.coords.latitude,
		currentPosition.coords.longitude,
	);
}

// 位置情報の取得に失敗した場合のエラーメッセージを返す関数
export function getLocationErrorMessage(error: unknown): string {
	if (error instanceof Error && error.message === UI_MESSAGES.PERMISSION_DENIED) {
		return UI_MESSAGES.PERMISSION_DENIED;
	}
	return UI_MESSAGES.FETCH_FAILED;
}
