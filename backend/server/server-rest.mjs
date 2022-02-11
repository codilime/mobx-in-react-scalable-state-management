import express from 'express';
import bodyParser from 'body-parser';
import { serverState } from "./server-state.mjs";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const expressPort = 4001;

app.get('/api/users', (req, res) => {
  res.json(serverState.users);
});

app.post('/api/users', (req, res) => {
  const newUser = {...req.body, id: serverState.nextUserId() };
  serverState.users.push(newUser);
  res.json(newUser);
});

app.put('/api/users/{id}', (req, res) => {
  const userId = req.params.id;
  const user = serverState.users.find(u=>u.id === userId);
  if (user) {
    Object.assign(user, req.body);
    res.json(user);
  } else {
    res.sendStatus(404);
  }
});

app.delete('/api/users', (req, res) => {
  const ids = req.query.ids?.split(',');
  serverState.users = serverState.users.filter((user) => !ids.includes(user.id.toString()));
  res.sendStatus(200);
});

app.listen(expressPort, () => {
  console.log(`🚀 REST Server ready at http://localhost:${expressPort}`);
});
