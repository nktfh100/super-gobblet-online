import { View } from "react-native";

const r_ = 20;
export default function BoardVerticalLine({ borderRadiusTop = true, borderRadiusBottom = true }) {
    return (<View style={{ height: "100%", width: 10, backgroundColor: "#1e1c21", borderTopLeftRadius: borderRadiusTop ? r_ : 0, borderTopRightRadius: borderRadiusTop ? r_ : 0, borderBottomLeftRadius: borderRadiusBottom ? r_ : 0, borderBottomRightRadius: borderRadiusBottom ? r_ : 0 }} />);
}