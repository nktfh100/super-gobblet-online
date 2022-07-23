import { View } from "react-native";
import { useRoomStore } from "../../store/useRoomStore";
import BoardVerticalLine from "./BoardVerticalLine";
import Cell from "./Cell";

export default function Row({ pos }) {

    const roomBoard = useRoomStore((state) => state.room.board);

    return (
        <View style={{flex: 1, flexDirection: "row"}}>
            <Cell cellData={roomBoard[pos][0].value} rowNum={pos} num={0}/>
            <BoardVerticalLine borderRadiusBottom={pos < 2 ? false : true} borderRadiusTop={pos > 0 ? false : true} />
            <Cell cellData={roomBoard[pos][1].value} rowNum={pos} num={1}/>
            <BoardVerticalLine borderRadiusBottom={pos < 2 ? false : true} borderRadiusTop={pos > 0 ? false : true} />
            <Cell cellData={roomBoard[pos][2].value} rowNum={pos} num={2}/>
        </View>
    );
}
