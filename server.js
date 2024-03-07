const http = require('http');
const Koa = require('koa');
const WS = require('ws');
const chatDB = require('./db/chatDB');
const usersDB = require('./db/usersDB');

const app = new Koa();
const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
const wsServer = new WS.Server({ server });

function sendToAllClients(eventData) {
  Array.from(wsServer.clients)
    .filter(client => client.readyState === WS.OPEN)
    .forEach(client => client.send(eventData));
}

wsServer.on('connection', (ws) => {
  let userName = null;

  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    const { user, message } = data;

    if (user) {
      userName = user.name;
      const isUserExists = usersDB.get()
        .some((user) => user.name.toLowerCase() === userName.toLowerCase());

      if (!isUserExists) {
        usersDB.add(user);

        const eventData = JSON.stringify({ user: 'User added', usersDB: usersDB.get() });
        sendToAllClients(eventData);
      } else {
        const eventData = JSON.stringify({ userExists: 'Данный псевдоним уже занят' });
        ws.send(eventData);
      }
    }

    if (message) {
      chatDB.add(message);

      const eventData = JSON.stringify({ chatDB: chatDB.get() });
      sendToAllClients(eventData);
    }
  });

  ws.on('close', () => {
    usersDB.delete(userName);

    if (usersDB.get().length === 0) {
      chatDB.clear();

      return;
    }

    const eventData = JSON.stringify({ usersDB: usersDB.get() });
    sendToAllClients(eventData);
  });

  ws.send(JSON.stringify({
    usersDB: usersDB.get(),
    chatDB: chatDB.get(),
  }));
});

server.listen(port);
