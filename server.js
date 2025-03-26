const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let button1Active = false;
let button2Active = false;

io.on('connection', (socket) => {
    console.log('Un utente connesso');

    socket.on('toggleButton', (buttonId) => {
        if (buttonId === 1) {
            button1Active = !button1Active; // Toggle stato
            socket.emit('buttonStatus', { buttonId: 1, status: button1Active });
        } else if (buttonId === 2) {
            button2Active = !button2Active; // Toggle stato
            socket.emit('buttonStatus', { buttonId: 2, status: button2Active });
        }

        // Verifica logica AND
        if (button1Active && button2Active) {
            io.emit('buttonUpdate', 'AND active');
        } else {
            io.emit('buttonUpdate', 'AND not active');
        }
    });

    socket.on('disconnect', () => {
        console.log('Utente disconnesso');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
