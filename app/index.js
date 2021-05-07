import express from 'express';
import compression from 'compression';
import cors from 'cors';
import routes from './routes';
import { isAddress } from './utils/utils';
import Peer from './models/peer';

if (process.env.NODE_ENV === 'dev' && process.env.SYS === 'desktop') {
  const args = process.argv.slice(2);
  const [ip] = args;
  if (isAddress(ip)) {
    process.env.ADDR = ip;
  } else {
    throw Error('Input address is not valid');
  }
}
const app = express();
app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
const peer = new Peer();
app.use(routes(peer));

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
