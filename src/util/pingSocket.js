export default socket => {
  socket.ping = {
    lastPing: null,
    state: 'COMPLETE', // pending, complete, await
    timeout: null
  };
  const pingInterval = 40000;
  const pingTimeout = 10000;

  const sPing = socket.ping;

  socket.receive('CONNECTION_PONG', ping => {
    if (ping === sPing.lastPing) sPing.state = 'COMPLETE';
  });

  const cycle = () => {
    if (sPing.state !== 'COMPLETE') {
      socket.close();
      return;
    }

    sPing.state = 'AWAIT';
    sPing.timeout = window.setTimeout(e => {
      sPing.lastPing = new Date() * 1;
      socket.comm('CONNECTION_PING', sPing.lastPing);
      sPing.state = 'PENDING';
      sPing.timeout = window.setTimeout(e => cycle(), pingTimeout);
    }, pingInterval);
  };
  cycle();
};
