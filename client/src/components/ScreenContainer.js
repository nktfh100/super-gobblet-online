import { View } from "react-native";
import Background from "./Background";
import CustomHeader from "./CustomHeader";

export default function ScreenContainer({ children, showHeader = true, containerStyle, headerProps }) {
    return (
        <Background>
            {showHeader ? <CustomHeader {...headerProps} /> : null}
            <View style={containerStyle}>
                {children}
            </View>
        </Background>
    );
}