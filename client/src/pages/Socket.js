import React, {useEffect,useState} from 'react'
const io = require('socket.io-client');
const socket = io('0:0:0:0:0:0:0:1');

export default function Socket() {
    const [messageCount, setMessageCount] = useState(0);
    useEffect(() => {
        socket.on('Socket', payload => {
          setMessageCount(messageCount + 1);
        });
      }, []);
  return (
    <div class="theme-1">
       <p>received {messageCount} messages</p>
     </div>
  )
}
