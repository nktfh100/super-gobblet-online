import { ImageBackground, useWindowDimensions } from "react-native";

export default function Background({ children }) {
    const { height, width } = useWindowDimensions();
    return (
        <ImageBackground source={require("../../assets/images/background.png")} style={{ flex: 1, height: height }}>
            {children}
        </ImageBackground>
    );
}