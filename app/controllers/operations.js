import wrap from '../utils/asyncWrapper';
// import Peer from '../models/peer';

// const peer = new Peer();

const get = (peer) => wrap(async (req, res) => {
  const { key } = req.body;
  const result = await peer.get(key);
  if (result) {
    return res.json({ status: 'success', result });
  }
  return res.sendStatus(400);
});

const set = (peer) => wrap(async (req, res) => {
  const { key, value } = req.body;
  const result = await peer.set(key, value);
  if (result) {
    return res.json({ status: 'success' });
  }
  return res.sendStatus(400);
});

const del = (peer) => wrap(async (req, res) => {
  const { key } = req.body;
  const result = await peer.set(key);
  if (result) {
    return res.json({ status: 'success' });
  }
  return res.sendStatus(400);
});

const showAll = (peer) => wrap(async (req, res) => {
  const result = await peer.showAll();
  if (result) {
    return res.json({ status: 'success', result });
  }
  return res.sendStatus(400);
});

const join = (peer) => wrap(async (req, res) => {
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

const info = (peer) => wrap(async (req, res) => {
  const { host } = req.body;
  try {
    const result = await peer.info(host);
    if (result) {
      return res.json({ status: 'success', result });
    }
    return res.sendStatus(400);
  } catch (e) {
    return res.sendStatus(400);
  }
});

const ping = (peer) => wrap(async (req, res) => {
  console.log('Interface pinging invoked');
  return res.json({ status: 'success' });
});

export default {
  get,
  set,
  del,
  showAll,
  join,
  info,
  ping,
};
