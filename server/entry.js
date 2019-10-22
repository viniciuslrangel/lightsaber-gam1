import socketio from 'socket.io'

export default function entry(httpServer) {
	const io = socketio(httpServer)
	io.on('connection', client => {
		console.log(`Connection accepted ${client.conn.remoteAddress}`)
		client.on('rotation', (data) => {
			client.broadcast.emit('rotation', data)
		})
	})
}
