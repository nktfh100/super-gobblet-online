import { useCallback, useEffect, useRef } from "react";
import { Animated, Image, View } from "react-native";
import { DraxView } from 'react-native-drax';
import socket from "../../services/socket";
import { useDraggingStore } from "../../store/useDraggingStore";
import { useRoomStore } from "../../store/useRoomStore";
import { useSoundsStore } from "../../store/useSoundsStore";
import { imageToSoldierType } from "../../utils/utils";

const CellRender = ({ cellData, rowNum, num }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const blinkAnim = useRef(new Animated.Value(0)).current;

    const lastCellUpdated = useRoomStore((state) => state.lastCellUpdated);

    let cellPlayerNum, cellSoldierType = undefined;
    if (cellData != "") {
        cellPlayerNum = cellData.substring(0, 1);
        cellSoldierType = cellData.substring(1, 2);
    }

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start(fadeAnim.resetAnimation());
    };

    useEffect(() => {
        if (lastCellUpdated && lastCellUpdated.x == num && lastCellUpdated.y == rowNum) {
            fadeIn();
        }
    }, [lastCellUpdated])

    useEffect(() => {
        const blinkAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1,
                    useNativeDriver: true
                }),
                Animated.delay(Math.floor((Math.random() * 2000) + 3000)),
                Animated.parallel([
                    Animated.timing(blinkAnim, {
                        toValue: 1,
                        duration: 1,
                        useNativeDriver: true
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 1,
                        useNativeDriver: true
                    }),
                ]),
                Animated.delay(120),
                Animated.parallel([
                    Animated.timing(blinkAnim, {
                        toValue: 0,
                        duration: 1,
                        useNativeDriver: true
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 1,
                        useNativeDriver: true
                    }),
                ]),
                Animated.delay(Math.floor((Math.random() * 500) + 500))
            ]));

        blinkAnimation.start();

        return () => {
            blinkAnimation.stop();
        }
    }, [])


    if (cellData == "") {
        return (
            <View style={{ flex: 1 }} />
        );
    }

    let size = "90";
    switch (cellSoldierType) {
        case "0":
            size = "65";
            break;
        case "1":
            size = "80";
            break
        default:
            break;
    }
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", position: "relative" }}>
            <Animated.View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center", opacity: fadeAnim }}>
                <Image style={{ width: size + "%", height: size + "%", resizeMode: "contain", }} source={imageToSoldierType(cellPlayerNum, cellSoldierType)} />
            </Animated.View>
            <Animated.View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center", opacity: blinkAnim, position: "absolute" }}>
                <Image style={{ width: size + "%", height: size + "%", resizeMode: "contain", }} source={imageToSoldierType(cellPlayerNum, cellSoldierType, true)} />
            </Animated.View>
            {lastCellUpdated && lastCellUpdated.x == num && lastCellUpdated.y == rowNum ?
                <Image style={{ width: "120%", height: "120%", top: "-20%", position: "absolute" }} source={require("../../../assets/images/smoke.gif")} />
                : null}
        </View>
    );
}

export default function Cell({ rowNum, num, cellData }) {

    const roomBoard = useRoomStore((state) => state.room.board);
    const setRoomData = useRoomStore((state) => state.setRoomData);
    const setOldRoomData = useRoomStore((state) => state.setOldRoomData);

    const setLastCellUpdated = useRoomStore((state) => state.setLastCellUpdated);

    const currentlyDragging = useDraggingStore((state) => state.dragging);
    const setDragging = useDraggingStore((state) => state.setDragging);

    let opacity_ = 1;

    let cellPlayerNum, cellSoldierType = undefined;
    if (roomBoard) {
        cellData = roomBoard[rowNum][num].value;
        if (cellData != "") {
            cellPlayerNum = cellData.substring(0, 1);
            cellSoldierType = cellData.substring(1, 2);
        }
    }

    if (currentlyDragging && cellData != "") {
        if (parseInt(cellSoldierType) >= parseInt(currentlyDragging)) {
            opacity_ = 0.4;
        }
    }

    const dragDrop = useCallback(({ dragged: { payload } }) => {
        setDragging(undefined);
        if (!cellPlayerNum || parseInt(currentlyDragging) > parseInt(cellSoldierType)) {
            socket.emit("turn", payload, rowNum, num);


            setOldRoomData(JSON.parse(JSON.stringify(useRoomStore.getState().room)));

            let newRoomData = JSON.parse(JSON.stringify(useRoomStore.getState().room));
            const playerNum = socket.id == newRoomData.players[0].socketId ? 0 : 1;

            newRoomData.board[rowNum][num].value = `${playerNum}${currentlyDragging}`;
            newRoomData.turn = newRoomData.players.find((p) => p.socketId != socket.id).socketId;
            switch (parseInt(currentlyDragging)) {
                case 0:
                    newRoomData.players[playerNum].pieces.small--;
                    break;
                case 1:
                    newRoomData.players[playerNum].pieces.medium--;
                    break;
                case 0:
                    newRoomData.players[playerNum].pieces.large--;
                    break;
                default:
                    break;
            }
            newRoomData.turnStartedAt = new Date();

            setRoomData(newRoomData);
            setLastCellUpdated({ y: rowNum, x: num });

            const playSound = useSoundsStore.getState().playSound;
            if (cellPlayerNum) {
                playSound("eat");
            } else {
                playSound("place");
            }
        }
    }, [cellData, currentlyDragging]);

    const renderContentCB = useCallback(({ viewState }) => {
        return <CellRender cellData={cellData} viewState={viewState} rowNum={rowNum} num={num} />
    }, [cellData]);

    return (
        <DraxView onReceiveDragDrop={dragDrop} style={{ width: "30%", opacity: opacity_ }} renderContent={renderContentCB} />
    );
}