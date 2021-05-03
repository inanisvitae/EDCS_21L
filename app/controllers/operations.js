import wrap from '../utils/asyncWrapper';
import Peer from '../models/peer';

const peer = new Peer();

const get = wrap(async (req, res) => {
  const { key } = req.body;
  const result = await peer.get(key);
  if (result) {
    res.json({ status: 'success' });
  } else {
    res.sendStatus(400);
  }
});

const set = wrap(async (req, res) => {
  const { key, value } = req.body;
  const result = await peer.set(key, value);
  if (result) {
    res.json({ status: 'success' });
  } else {
    res.sendStatus(400);
  }
});

const del = wrap(async (req, res) => {
  const { key } = req.body;
  const result = await peer.set(key);
  if (result) {
    res.json({ status: 'success' });
  } else {
    res.sendStatus(400);
  }
});

const showAll = wrap(async (req, res) => {
  res.json({ status: 'success' });
});

const join = wrap(async (req, res) => {
  const { host } = req.body;
  try {
    const result = await peer.join(host);
    if (result) {
      return res.json({ status: 'success' });
    }
    return res.sendStatus(400);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
});

const info = wrap(async (req, res) => {
  const { host } = req.body;
  try {
    const result = await peer.info(host);
    if (result) {
      res.json({ status: 'success', result });
    }
    return res.sendStatus(400);
  } catch (e) {
    return res.sendStatus(400);
  }
});

export default {
  get,
  set,
  del,
  showAll,
  join,
  info,
};
