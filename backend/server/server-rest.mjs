import express from 'express';
import bodyParser from 'body-parser';
import { serverState } from './server-state.mjs';
import _ from 'lodash';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const expressPort = 4001;

const RESPONSE_DELAY = 1000;

app.get('/api/users', (req, res) => {
  setTimeout(() => res.json(serverState.users), RESPONSE_DELAY);
});

app.get('/api/users/:id/details', (req, res) => {
  setTimeout(() => {
    if (req.params.id === '1') {
      res.json({
        auditTrail: _.shuffle([
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
        ]),
      });
    } else {
      res.json({
        auditTrail: _.shuffle([
          {
            id: '666',
            name: 'Sign Out',
            details: 'Host: 10.0.0.123, Windows, Firefox',
            createdAt: 'Feb 18, 2022 10:23',
          },
          {
            id: '777',
            name: 'Password change',
            details: 'Host: 10.0.0.123, Windows, Firefox',
            createdAt: 'Feb 17, 2022 07:08',
          },
          {
            id: '888',
            name: 'Sign In',
            details: 'Host: 10.0.0.123, Windows, Firefox',
            createdAt: 'Jan 13, 2022 12:34',
          },
          {
            id: '999',
            name: 'Password change',
            details: 'Host: 10.0.0.123, Windows, Firefox',
            createdAt: 'Jan 11, 2022 12:34',
          },
        ]),
      });
    }
  }, RESPONSE_DELAY);
});

app.post('/api/users', (req, res) => {
  const newUser = { ...req.body, id: serverState.nextUserId() };
  serverState.users.push(newUser);
  setTimeout(() => res.json(newUser), RESPONSE_DELAY);
});

app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = serverState.users.find((u) => u.id === userId);
  if (user) {
    Object.assign(user, req.body);
    setTimeout(() => res.json(user), RESPONSE_DELAY);
  } else {
    setTimeout(() => res.sendStatus(404), RESPONSE_DELAY);
  }
});

app.delete('/api/users', (req, res) => {
  const ids = req.query.ids?.split(',');
  serverState.users = serverState.users.filter(
    (user) => !ids.includes(user.id.toString()),
  );
  setTimeout(() => res.sendStatus(200), RESPONSE_DELAY);
});

app.listen(expressPort, () => {
  console.log(`🚀 REST Server ready at http://localhost:${expressPort}`);
});
