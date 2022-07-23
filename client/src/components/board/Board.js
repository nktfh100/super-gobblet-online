import { useWindowDimensions, View } from "react-native";
import BoardHorizontalLine from "./BoardHorizontalLine";
import Row from "./Row";

export default function Board() {
    const { height, width } = useWindowDimensions();

    return (
        <View style={{ marginTop: 10, alignItems: "center", height: height * 0.5 }}>
            <Row pos={0} />
            <BoardHorizontalLine />
            <Row pos={1} />
            <BoardHorizontalLine />
            <Row pos={2} />
        </View>
    );
}
