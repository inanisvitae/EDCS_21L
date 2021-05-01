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

export {
  sha1,
  isIpv4,
  isPort,
  isAddress,
};
