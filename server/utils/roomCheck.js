var checkRoom = (roomsArr, currentRoom) => {
    for (let elem in roomsArr){
        if(roomsArr[elem].name == currentRoom){
            return elem
        }
    }
}

module.exports = {checkRoom}
