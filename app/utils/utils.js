import crypto from 'crypto';
import _ from 'underscore';
import net from 'net';
import * as grpc from '@grpc/grpc-js';

const sha1 = (val) => crypto
  .createHash('sha1')
  .update(val)
  .digest()
  .toString('hex');

const isIpv4 = (ip) => net.isIPv4(ip);

const isPort = (port) => _.isNumber(port) && port >= 1 && port <= 65536;

const isAddress = (host) => {
  if (!_.isString(host)) { return false; }
  const [ip, port, invalidStr] = host.trim().split(':');
  if (invalidStr) { return false; }
  return isIpv4(ip) && isPort(parseInt(port, 10));
};

const isClean = (str) => _.isString(str);

const execRpc = (proto, protoInterface) => (host, method, request) => {
  console.log(`Executed RPC on ${host} with method: ${method}with request: ${JSON.stringify(request)}`);
  const client = new proto[protoInterface](host, grpc.credentials.createInsecure());
  return new Promise((resolve, reject) => {
    client[method](request, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
      client.close();
    });
  });
};

const isLocatedBetween = (lower, curr, upper) => {
  // Keys will never be the same
  if (lower < upper) {
    return lower < curr && curr < upper;
  }
  return lower < curr || curr < upper;
};

const fromStringToDecimal = (hexStr) => parseInt(`0x${hexStr}`, 16);

export {
  sha1,
  isIpv4,
  isPort,
  isAddress,
  isClean,
  execRpc,
  isLocatedBetween,
  fromStringToDecimal,
};
