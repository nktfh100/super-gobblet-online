import Constants from "expo-constants";
import io from "socket.io-client";

const apiUrl = __DEV__
	? Constants.manifest && Constants.manifest.debuggerHost
		? `http://${Constants.manifest.debuggerHost.split(":").shift()}:3000`
		: ""
	: "https://gobblet-server.malachi.io";

const socket = io(apiUrl, { transports: ["websocket"] });

export default socket;
