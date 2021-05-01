import wrap from '../utils/asyncWrapper';
import Peer from '../models/peer';

const peer = new Peer();
peer.start();

const get = wrap(async (req, res) => {
  const { key } = req.body;
  const result = await peer.get(key);
  if (result) {
    res.json({ status: 'success' });
  } else {
    res.status(400);
  }
});

const set = async (req, res) => {
  const { key, value } = req.body;
  const result = await peer.set(key, value);
  if (result) {
    res.json({ status: 'success' });
  } else {
    res.status(400);
  }
};

const del = wrap(async (req, res) => {
  const { key } = req.body;
  const result = await peer.set(key);
  if (result) {
    res.json({ status: 'success' });
  } else {
    res.status(400);
  }
});

const showAll = wrap(async (req, res) => {
  res.json({ status: 'success' });
});

const join = wrap(async (req, res) => {
  const { host } = req.body;
  const result = await peer.join(host);
  if (result) {
    res.json({ status: 'success' });
  } else {
    res.status(400);
  }
});

export default {
  get,
  set,
  del,
  showAll,
  join,
};
