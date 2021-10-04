import app from './app';
import database from './database';
import GamesController from './controller/CrashGameController';
import websocket from './controller/WebSocket';

// CREATE DATABASE CONNECTION //
database.createConnection();

// START GAMES //
GamesController.startCrashGame();

// START WEBSOCKET //
websocket.startServer(30121);

// START SERVER //
app.startServer(30120);