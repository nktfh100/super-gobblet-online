import { Image, View } from "react-native";
import MyAppText from "./MyAppText";

function Soldier({ image, count, typeNum }) {
    return (
        <View style={{ position: "relative" }}>
            <Image style={{ width: 30, resizeMode: "contain" }} source={image} />
            <MyAppText style={{ fontSize: 22, position: 'absolute', right: typeNum == 1 ? -3 : typeNum == 0 ? -8 : -10, top: typeNum == 2 ? -5 : 0 }}>{count}</MyAppText>
        </View>
    );
}

export default function SoldiersCount({ player }) {
    return (
        <View style={{ justifyContent: "space-evenly", alignItems: "center", flexDirection: "row", width: "40%" }}>
            <Soldier image={require('../../assets/images/circle_small.png')} count={player ? player.pieces.small : 0} typeNum={0} />
            <Soldier image={require('../../assets/images/triangle_small.png')} count={player ? player.pieces.medium : 0} typeNum={1} />
            <Soldier image={require('../../assets/images/rectangle_small.png')} count={player ? player.pieces.large : 0} typeNum={2} />
        </View>
    );
}