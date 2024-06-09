// import { AdMobInterstitial, setTestDeviceIDAsync, } from 'expo-ads-admob';
// import * as Device from 'expo-device';
// import Constants from "expo-constants";

export function getCorrectAdId(prodId, testId) {
	return "";
	// return Device.isDevice && !__DEV__ ? prodId : testId;
}

export function setupAds() {
	// AdMobInterstitial.setAdUnitID(getCorrectAdId(Constants.manifest.extra.AD_ID, "ca-app-pub-3940256099942544/6300978111"));
	// setTestDeviceIDAsync('EMULATOR');
}

export async function showAd() {
	// try {
	//     await AdMobInterstitial.requestAdAsync();
	//     await AdMobInterstitial.showAdAsync();
	// } catch (error) {
	//     console.log(error);
	// }
}
