import { useRoomStore } from "../store/useRoomStore.js";
import { showErrorAlert } from "../utils/utils.js";

export default function turnError(showError, errorText) {
    let roomStore = useRoomStore.getState();
    if (!roomStore.room) {
        return;
    }
    if (roomStore.oldRoom) {
        useRoomStore.setState({ room: JSON.parse(JSON.stringify(roomStore.oldRoom)), oldRoom: undefined, lastCellUpdated: null });
    }

    if (showError) {
        showErrorAlert(errorText);
    }
}