# EDCS_21L
Distributed System implementing chord protocol

#### Description
The whole system acts like a doubly linked list. Head is the string 'HEAD', tail is the string 'TAIL'. When a node joins the network, it notifies its predecessor and successor of joining.

#### Run
Make sure that port 3000 and 50051 are both open and firewall doesn't block these ports.<br />
Install yarn or npm. If you want to launch the project on desktop, you need to enter IP by yourself.<br />
{ip} is the external IP address for your computer in local network. <br />
yarn<br />
yarn build<br />
yarn start:desktop {ip}<br />

Then go to http://localhost:3000 <br />

However if you want to launch the project on server, you don't need to manually input the IP because on server the project can get the correct IP(I assume) <br />
yarn<br />
yarn build<br />
yarn start:server<br />
