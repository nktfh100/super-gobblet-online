import { useEffect, useState } from "react";
import { Image, useWindowDimensions, View } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import socket from "../services/socket";
import MyAppText from "../components/MyAppText";
import { useRoomStore } from "../store/useRoomStore";
import UsernameBox from "../components/UsernameBox";
import SoldiersCount from "../components/SoldiersCount";
import Board from "../components/board/Board";
import PieceContainer from "../components/YourPieceContainer";
import { DraxProvider } from "react-native-drax";
import MyModal from "../components/MyModal";
import { getTimePassed } from "../utils/utils";

export default function GameScreen() {
    const { height, width } = useWindowDimensions();

    const roomData = useRoomStore((state) => state.room);

    const [turnTime, setTurnTime] = useState(0);

    useEffect(() => {
        setTurnTime(60 - getTimePassed(roomData.turnStartedAt));
        const interval = setInterval(() => {
            let newVal = 60 - getTimePassed(roomData.turnStartedAt);
            if (newVal < 0) {
                if (roomData.turn == socket.id || newVal < -10) {
                    socket.emit('turn-timer-ended');
                }
                newVal = 0;
            }
            setTurnTime(newVal);
        }, 1000);

        return () => clearInterval(interval);
    }, [roomData.turnStartedAt]);

    let playerMe = undefined;
    let otherPlayer = undefined;
    if (roomData && roomData.players) {
        playerMe = roomData.players.find(p => p.socketId == socket.id);
        otherPlayer = roomData.players.find(p => p.socketId != socket.id)
    }

    if (!playerMe) {
        return (<ScreenContainer showHeader={true} />);
    }

    const playerNum = roomData.players[0].socketId == socket.id ? 0 : 1;

    let playAgainRequest = playerMe.playAgain || (otherPlayer.playAgain);
    if (otherPlayer.left) {
        playAgainRequest = false;
    }
    return (
        <ScreenContainer showHeader={true} containerStyle={{ flex: 1 }}>
            <DraxProvider style={{ flex: 1 }}>
                <View style={{ marginTop: 5, justifyContent: 'space-evenly', alignItems: "center", flexDirection: "row" }}>
                    <UsernameBox username={playerMe.username} playerNum={playerNum} />
                    <Image style={{ width: 52, height: 52 }} source={require("../../assets/images/vs_icon.png")} />
                    <UsernameBox username={otherPlayer ? otherPlayer.username : "..."} playerNum={playerNum == 0 ? 1 : 0} />
                </View>
                <View style={{ justifyContent: 'space-evenly', alignItems: "center", flexDirection: "row" }}>
                    <SoldiersCount player={playerMe} />
                    <MyAppText style={{ width: "15%", textAlign: "center", fontSize: 37, color: turnTime > 0 && turnTime <= 10 && roomData.turn == socket.id ? "red" : "black" }}>{turnTime}</MyAppText>
                    <SoldiersCount player={otherPlayer ? otherPlayer : null} />
                </View>

                <Board />

                <View style={{ marginTop: "auto", marginBottom: "auto", flexDirection: "row", justifyContent: "space-evenly", opacity: roomData.turn == socket.id ? 1 : 0.6 }}>
                    <PieceContainer count={playerMe.pieces.small} playerNum={playerNum} type='0' />
                    <PieceContainer count={playerMe.pieces.medium} playerNum={playerNum} type='1' />
                    <PieceContainer count={playerMe.pieces.large} playerNum={playerNum} type='2' />
                </View>

            </DraxProvider>
            <MyModal type={0} visible={roomData.ended && roomData.winner && roomData.winner == socket.id && !playAgainRequest} backgroundImg={require('../../assets/images/won_modal.png')} />
            <MyModal type={0} visible={roomData.ended && roomData.winner && roomData.winner != socket.id && !playAgainRequest} backgroundImg={require('../../assets/images/lost_modal.png')} />
            <MyModal type={0} visible={roomData.ended && !roomData.winner && !playAgainRequest} backgroundImg={require('../../assets/images/tie_modal.png')} />
            <MyModal type={1} visible={roomData.ended && !otherPlayer.left && otherPlayer.playAgain} text={otherPlayer.username + " wants to play again"} backgroundImg={require('../../assets/images/empty_modal.png')} />
            <MyModal type={2} visible={roomData.ended && !otherPlayer.left && playerMe.playAgain} text={"Waiting for " + otherPlayer.username} backgroundImg={require('../../assets/images/empty_modal.png')} />
        </ScreenContainer>
    );
}
