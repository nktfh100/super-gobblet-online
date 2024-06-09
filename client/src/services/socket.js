import io from 'socket.io-client';
import Constants from "expo-constants";

const apiUrl = __DEV__
    ? Constants.manifest && Constants.manifest.debuggerHost ? `http://${Constants.manifest.debuggerHost.split(':').shift()}:3000` : "" :
    "https://gobblet-online.server.nktfh100.com";

const socket = io(apiUrl, { transports: ['websocket'] });

export default socket;