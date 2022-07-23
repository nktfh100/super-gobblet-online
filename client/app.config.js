
export default {
  "name": "Super Gobblet Online",
  "slug": "super-gobblet-online",
  "version": "1.0.3",
  "orientation": "portrait",
  "icon": "./assets/icon.png",
  "userInterfaceStyle": "light",
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#000000"
  },
  "updates": {
    "fallbackToCacheTimeout": 0
  },
  "assetBundlePatterns": [
    "**/*"
  ],
  "ios": {
    "supportsTablet": true
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#FFFFFF"
    },
    "config": {
      "googleMobileAdsAppId": process.env.ADS_APP_ID
    },
    "package": "com.nktfh100.supergobbletonline",
    "versionCode": 5
  },
  "web": {
    "favicon": "./assets/favicon.png"
  },
  "extra": {
    "eas": {
      "projectId": "6ef54a29-2336-47a6-b13c-4c973c652ffe"
    },
    'AD_ID': process.env.AD_ID
  }
}