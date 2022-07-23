import { Alert } from "react-native";

export function showErrorAlert(text) {
    Alert.alert(
        "Error",
        text,
        [{ text: "OK" }]
    );
}

const redCircle = require("../../assets/images/red_circle.png");
const blueCircle = require("../../assets/images/blue_circle.png");
const redTriangle = require("../../assets/images/red_triangle.png");
const blueTriangle = require("../../assets/images/blue_triangle.png");
const redRectangle = require("../../assets/images/red_rectangle.png");
const blueRectangle = require("../../assets/images/blue_rectangle.png");

const redCircleBlink = require("../../assets/images/red_circle_b.png");
const blueCircleBlink = require("../../assets/images/blue_circle_b.png");
const redTriangleBlink = require("../../assets/images/red_triangle_b.png");
const blueTriangleBlink = require("../../assets/images/blue_triangle_b.png");
const redRectangleBlink = require("../../assets/images/red_rectangle_b.png");
const blueRectangleBlink = require("../../assets/images/blue_rectangle_b.png");

const soldiersTable = {
    "00": blueCircle,
    "01": blueTriangle,
    "02": blueRectangle,
    "10": redCircle,
    "11": redTriangle,
    "12": redRectangle,
    "00b": blueCircleBlink,
    "01b": blueTriangleBlink,
    "02b": blueRectangleBlink,
    "10b": redCircleBlink,
    "11b": redTriangleBlink,
    "12b": redRectangleBlink,
}

export function imageToSoldierType(playerNum, type, blinking = false) {
    return soldiersTable[`${String(playerNum)}${String(type)}${blinking ? "b" : ""}`]
}

export function getTimePassed(startTime) {
    if (!startTime) {
        return -1;
    }
    let startTime_ = new Date(startTime);
    let endTime = new Date();

    let secondsPassed = Math.round((endTime - startTime_) / 1000);

    return secondsPassed;
}
