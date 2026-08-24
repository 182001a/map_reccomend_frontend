import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Alert, Pressable, View, Text } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { Region } from 'react-native-maps';

import { UI_MESSAGES } from '../constants/locationMessages';
import { mapScreenStyles as styles } from '../styles/style';
import { getCurrentRegion, getLocationErrorMessage } from '../utils/location';

// 現在地取得の状態管理
type LocationState = {
	region: Region | null;      // 取得成功
	isLoading: boolean;         // ローディング中かどうか
	errorMsg: string | null;    // エラーメッセージ
};

export default function MapScreen() {
	// @note useRef
	// 再レンダリングの影響を受けずに値を保持するために使用
	// MapViewの参照を保持してMapViewのメソッドを呼び出す
	const mapRef = useRef<MapView | null>(null);
	const [isLocatingCurrentPosition, setIsLocatingCurrentPosition] = useState(false);

	// 位置情報の状態を管理
	const [locationState, setLocationState] = useState<LocationState>({
		region: null,
		isLoading: true,
		errorMsg: null,
	});

	// ボタン押下時に現在地を再取得してマップの中心を移動する
	async function moveToCurrentLocation(): Promise<void> {
		try {
			setIsLocatingCurrentPosition(true);
			const currentRegion = await getCurrentRegion();
			setLocationState({
				region: currentRegion,
				isLoading: false,
				errorMsg: null,
			});
			// @note mapRef.current?.animateToRegion
			// mapRef.currentが存在する場合にanimateToRegionを呼び出す（条件分岐を省略した記法）
			mapRef.current?.animateToRegion(currentRegion, 500);
		} catch (error) {
			Alert.alert(getLocationErrorMessage(error));
		} finally {
			setIsLocatingCurrentPosition(false);
		}
	}

	// コンポーネントのマウント時に現在地を取得する
	useEffect(() => {
		let isMounted = true; // コンポーネントがマウントされているかのフラグ

		// 安全に状態を更新するための関数
		const safeSetState = (state: LocationState): void => {
			if (!isMounted) {
				return;
			}
			setLocationState(state);
		};

		const fetchCurrentLocation = async (): Promise<void> => {
			try {
				const currentRegion = await getCurrentRegion();
				safeSetState({
					region: currentRegion,
					isLoading: false,
					errorMsg: null,
				});
			} catch (error) {
				safeSetState({
					region: null,
					isLoading: false,
					errorMsg: getLocationErrorMessage(error),
				});
			}
		};

		fetchCurrentLocation();
		// クリーンアップ関数でマウントフラグを更新
		// MapScreenがアンマウントされた後に非同期処理が完了しても状態を更新しないようにするため
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
		<View style={styles.mapWrapper}>
			<MapView
				ref={mapRef}
				style={styles.map}
				provider={PROVIDER_GOOGLE}
				region={locationState.region}
			>
				<Marker coordinate={locationState.region} title={UI_MESSAGES.CURRENT_LOCATION} />
			</MapView>
			<Pressable
				accessibilityLabel={UI_MESSAGES.MOVE_TO_CURRENT_LOCATION}
				disabled={isLocatingCurrentPosition}
				onPress={() => void moveToCurrentLocation()}
				style={[
					styles.currentLocationButton,
					isLocatingCurrentPosition && styles.currentLocationButtonDisabled,
				]}
			>
				{isLocatingCurrentPosition ? (
					<ActivityIndicator color="#1f6feb" />
				) : (
					<Ionicons name="locate" size={30} color="#0f1f3a" />
				)}
			</Pressable>
		</View>
	);
}
