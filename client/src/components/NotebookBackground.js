import { ImageBackground, View } from "react-native";

export default function NotebookBackground({ children, hasHeader }) {
    return (
        <View style={[{ marginTop: hasHeader ? 25 : 110, marginRight: -240 }, {
            transform: [{ rotate: "-9deg" }]
        }]}>
            <ImageBackground source={require("../../assets/images/notebook_background.png")} resizeMode="cover" style={{ width: 684, height: 889 }}>
                {children}
            </ImageBackground>
        </View>
    );
}