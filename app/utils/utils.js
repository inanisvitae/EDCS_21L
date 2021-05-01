import crypto from 'crypto';
import _ from 'underscore';
import net from 'net';

const sha1 = (val) => crypto
  .createHash('sha1')
  .update(val)
  .digest();

const isIpv4 = (ip) => net.isIPv4(ip);

const isPort = (port) => _.isNumber(port) && port >= 1 && port <= 65536;

const isAddress = (host) => {
  if (!_.isString(host)) { return false; }
  const [ip, port, invalidStr] = host.trim().split(':');
  if (invalidStr) { return false; }
  return isIpv4(ip) && isPort(parseInt(port, 10));
};

const isClean = (str) => _.isString(str);

const execRpc = (host, method, request) => {
  console.log(`Executed RPC on ${host} with method: ${method}with request: ${JSON.stringify(request)}`);
};

const bufferize = (str) => {

};

const debufferize = (str) => {

};

export {
  sha1,
  isIpv4,
  isPort,
  isAddress,
  isClean,
  execRpc,
  bufferize,
  debufferize,
};
