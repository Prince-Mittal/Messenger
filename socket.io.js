const SocketIO = require('socket.io');
const services = require('./services');
const auth = require('./auth/validToken');

module.exports = (server) => {
    const io = SocketIO(server);
    connected = {};
    connected2 = {}

    io.on('connection', function(socket){
        socket.on('new-connection', function(data) {
            const { Token } = data;
            const { authenticated, user} = auth.validToken(Token);
            if(!authenticated) return;
            const { id:_id } = user;

            connected[_id] = socket.id;
            connected2[socket.id] = _id;

            io.emit('user-status', { _id, status: true }); //extra

            socket.broadcast.emit('user-status', { _id, status: 1 });
            console.log('a user connected');
        });

        socket.on('create-private-chat-room', services.chat.createPrivateChatroom);

        socket.on('send-message', async (data, cb) => {
            const message = await services.messages.saveMessage(data, cb);
            console.log(message);
            data.receiver.forEach( e => {
                const socketid = connected[e._id];
                if(socketid) io.to(socketid).emit('new-message', {...message})
            });
        });

        socket.on('disconnect', function(){
            console.log('disconnect');
        })
    });
}