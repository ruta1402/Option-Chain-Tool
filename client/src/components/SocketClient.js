import React, { useEffect } from 'react';
import io from 'socket.io-client';

const SERVER_HOST = 'http://localhost:8989';

const SocketClient = () => {
  useEffect(() => {
    const socket = io(SERVER_HOST);

    // Receive data from the server
    socket.on('data', (data) => {
      console.log('Received data:', data);
      // Process the received data
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Socket Client</div>;
};

export default SocketClient;
