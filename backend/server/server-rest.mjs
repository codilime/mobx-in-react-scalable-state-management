import express from 'express';
import bodyParser from 'body-parser';
import { serverState } from './server-state.mjs';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const expressPort = 4001;

app.get('/api/users', (req, res) => {
  res.json(serverState.users);
});

app.get('/api/users/:id/details', (req, res) => {
  res.json({
    auditTrail: [
      {
        id: '333',
        name: 'Sign Out',
        details: 'Host: 1.2.3.4, Linux, Chrome',
        createdAt: 'Jan 7, 2022 16:23',
      },
      {
        id: '222',
        name: 'Password change',
        details: 'Host: 1.2.3.4, Linux, Chrome',
        createdAt: 'Jan 7, 2022 14:08',
      },
      {
        id: '111',
        name: 'Sign In',
        details: 'Host: 1.2.3.4, Linux, Chrome',
        createdAt: 'Jan 7, 2022 12:34',
      },
    ],
  });
});

app.post('/api/users', (req, res) => {
  const newUser = { ...req.body, id: serverState.nextUserId() };
  serverState.users.push(newUser);
  res.json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = serverState.users.find((u) => u.id === userId);
  if (user) {
    Object.assign(user, req.body);
    res.json(user);
  } else {
    res.sendStatus(404);
  }
});

app.delete('/api/users', (req, res) => {
  const ids = req.query.ids?.split(',');
  serverState.users = serverState.users.filter(
    (user) => !ids.includes(user.id.toString()),
  );
  res.sendStatus(200);
});

app.listen(expressPort, () => {
  console.log(`🚀 REST Server ready at http://localhost:${expressPort}`);
});
