import { StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';

import { UI_MESSAGES } from '../constants/locationMessage';

// 現在地取得の状態管理
type LocationState = {
	region: Region | null;      // 取得成功
	isLoading: boolean;         // ローディング中かどうか
	errorMsg: string | null;    // エラーメッセージ
};

export default function MapScreen() {

	// 位置情報の権限をリクエストする関数
	async function requestLocationPermission(): Promise<Location.PermissionStatus> {
		const permissionResponse = await Location.requestForegroundPermissionsAsync();
		return permissionResponse.status;
	}

	// 緯度経度からRegionオブジェクトを作成する関数
	function createRegionFromCoordinates(
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

	// 位置情報の状態を管理
	const [locationState, setLocationState] = useState<LocationState>({
		region: null,
		isLoading: true,
		errorMsg: null,
	});
	// コンポーネントのマウント時に現在地を取得する
	useEffect(() => {
		let isMounted = true; // コンポーネントがマウントされているかのフラグ
		
		const fetchCurrentLocation = async (): Promise<void> => {
			try {
				const permissionStatus = await requestLocationPermission();
				if (permissionStatus !== Location.PermissionStatus.GRANTED) {
					if (!isMounted) {
						return;
					}
					setLocationState({
						region: null,
						isLoading: false,
						errorMsg: UI_MESSAGES.PERMISSION_DENIED,
					});
					return;
				}
				const currentPosition = await Location.getCurrentPositionAsync({});
				const currentRegion = createRegionFromCoordinates(
					currentPosition.coords.latitude,
					currentPosition.coords.longitude,
				);
			if (!isMounted) {
				return;
			}
			setLocationState({
				region: currentRegion,
				isLoading: false,
				errorMsg: null,
			});
		} catch (error) {
			if (!isMounted) {
				return;
			}
			setLocationState({
				region: null,
				isLoading: false,
				errorMsg: UI_MESSAGES.FETCH_FAILED,
			});
		}
	};
		fetchCurrentLocation();
		return () => {
			isMounted = false;
		};
	}, []);

	// ローディング中
	if (locationState.isLoading) {
		return (
			<View style={styles.centerContainer}>
				<Text>{UI_MESSAGES.LOADING}</Text>
			</View>
		);
	}
	// エラー
	if (locationState.errorMsg) {
		return (
			<View style={styles.centerContainer}>
				<Text>{locationState.errorMsg}</Text>
			</View>
		);
	}
	// 現在地の情報がない場合
	if (locationState.region === null) {
		return (
			<View style={styles.centerContainer}>
				<Text>{UI_MESSAGES.NO_LOCATION}</Text>
			</View>
		);
	}
	// 現在地が取得できた場合
	return (
		<MapView
			style={{ flex: 1 }}
			provider={PROVIDER_GOOGLE}
			region={locationState.region}
		>
			<Marker coordinate={locationState.region} title={UI_MESSAGES.CURRENT_LOCATION} />
		</MapView>
	);
}

const styles = StyleSheet.create({
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});