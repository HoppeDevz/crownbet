import express from 'express'
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


io.on("connection", socket => {

    console.log(`New user connected! ${socket.id}`);

    socket.on("disconnect", reason => {

        console.log(`User disconnect - reason: ${reason}`);
    })
});

const globalEmit = (event: string, data: any) => {

    io.emit(event, data);
}

const startServer = (PORT: number) => {

    server.listen(PORT, () => console.log(`Web socket is running in port: ${PORT}`));
}


export default {
    startServer,
    globalEmit
};