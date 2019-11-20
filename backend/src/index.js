require('dotenv').config({ path: '.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// TODO User express middlware to handle cookies (JWT)
// TODO User express middlware to populate current user

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL,
    },
}, deets => {
    console.log(`Server is now running on http://localhost:${deets.port}`)
});