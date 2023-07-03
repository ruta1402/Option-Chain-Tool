import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Home from '../pages/Home';
const SERVER_HOST = 'http://localhost:8989';

const SocketClient = () => {
  var a = "ALLBANKS";
    var b = "MAINIDX";
    var c = "FINANCIAL";
    var d = "MIDCAPS";
  const [allbanksData,setAllbanksData] = useState([])
  const [mainIdxData,setMainIdxData] = useState([])
  const [finData,setFinData] = useState([])
  const [midCapsData,setMidCapsData] = useState([])

  useEffect(() => {
    const socket = io(SERVER_HOST);
    socket.on('connect', () => {
      console.log('Connected to the socket');
    });
    // Receive data from the server
    socket.on('data', (data) => {
      // console.log(data.Index);
      if(data.Index === a ){
        setAllbanksData(prevData => [...prevData,data])
        console.log(allbanksData);
      }else if(data.Index === b ){
        setMainIdxData(prevData => [...prevData,data])
        console.log(mainIdxData);
      }else if(data.Index === c ){
        setFinData(prevData => [...prevData,data])
        console.log(finData);
      }else if(data.Index === d ){
        setMidCapsData(prevData => [...prevData,data])
        console.log(midCapsData);
      }
      // Process the received data
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return 
  <div>Socket</div>
};

// export default SocketClient;
