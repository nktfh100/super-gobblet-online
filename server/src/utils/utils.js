function makeRoomCode(length = 6) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function makeUsername() {
    return `Anonymous${Math.floor(Math.random() * 99)}`;
}

function validateUsername(username) {
    return !!username && username.length >= 2 && username.length <= 11
        ? username
        : makeUsername();
}


function getTimePassed(startTime) {
    if (!startTime) {
        return -1;
    }
    let endTime = new Date();

    let secondsPassed = Math.round((endTime - startTime) / 1000);

    return secondsPassed;
}

module.exports = { makeRoomCode, makeUsername, validateUsername, getTimePassed }