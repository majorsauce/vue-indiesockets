import { EventEmitter } from "events"

export default class IndieSocketServer extends EventEmitter {

	constructor(server: any) {
		super()
		server.on("connection", (socket: any) => {
			this.emit("connected", new IndieSocketClient(socket))
		})
	}

}

class IndieSocketClient extends EventEmitter {

	socket: any

	constructor(socket: any) {
		super() 
		this.socket = socket
		
		socket.on("message", (message: string) => {
			const [name, ...data] = JSON.parse(message) 
			this.emit(name, data)
		})

		socket.on("close", () => {
			this.emit("disconnect")
		})

		socket.on("error", (e: Error) => {
			this.emit("error", e)
		})
	}

	// eslint-ignore-next-line
	send(name: string, ...data: any){
		this.socket.emit(JSON.stringify([name, data]))
	}

}