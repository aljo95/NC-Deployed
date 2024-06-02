
const socketIOExport = (io) => {
    
    const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    let userNames = [];
    io.sockets.on('connection', (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);
        
        socket.on('getTime', () => {
            const date = new Date();
            let currentDay = weekday[date.getDay()];
            let currentTime = (date.toLocaleString()).slice(11, 16);
            let fullTimeDisplay = currentDay + " " + currentTime;
            io.sockets.emit('getTime', fullTimeDisplay);
        });
        
        socket.on('sendMessage', async (message) => {

            const date = new Date();
            let currentDay = weekday[date.getDay()];
            let currentTime = (date.toLocaleString()).slice(11, 16);
            let fullTimeDisplay = currentDay + " " + currentTime;
            message.time = fullTimeDisplay;
            
            io.sockets.emit('message', message);
            const sockets = await io.sockets.fetchSockets();
            console.log("CONNECTED USERS: " + sockets.length);
        });

        socket.on("sendUsername", (username) => {

            if (!userNames.includes(username)) {
                userNames.push(username);
            }
            console.log("Logged in users (from the userNames array): ");
            console.log(userNames);
            io.sockets.emit('username', userNames);
        });

        socket.on("removeUser", (username) => {
            // Find index of username and remove it from array if it exists
            let index = userNames.indexOf(username);
            if (index !== -1) {
                userNames.splice(index, 1);
            }
            io.sockets.emit('username', userNames);
        });

        socket.on('disconnect', () => {
        console.log('A user disconnected');
        });
    });
};

module.exports = socketIOExport;
