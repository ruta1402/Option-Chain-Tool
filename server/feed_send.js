
const socketIO = require('socket.io');


function socket_con(server){
    const io = socketIO(server,{
        cors:{
          origin:"http://localhost:3000",
          methods:['GET',"POST"],
        }
      });
    
}

module.exports ={socket_con}
