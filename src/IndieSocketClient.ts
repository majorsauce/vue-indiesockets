import {EventEmitter} from "events"


export default class IndieSocketClient extends EventEmitter {

	socket: any
	debug: boolean

	constructor(socket: any, debug: boolean = false) {
		super()
		this.socket = socket
		this.debug = debug

		this.socket.on("message", (message: string) => {
			const [name, data] = JSON.parse(message)
			if (this.debug) console.log("[IndieSocket] Inbound message: " + name + " with value " + JSON.stringify(data))
			this.emit(name, data)
			if (message !== "_*") this.emit("_*", message, data)
		})

		this.socket.on("close", () => {
			if (this.debug) console.log("[IndieSocket] Client disconnected")
			this.emit("_disconnect")
		})

		this.socket.on("error", (e: Error) => {
			if (this.debug) console.log("[IndieSocket] Error occured: " + e)
			this.emit("_error", e)
		})
	}

	// eslint-ignore-next-line
	send(name: string, data: any) {
		if (this.debug) console.log("[IndieSocket] Outbound message: " + name + " with value " + JSON.stringify(data))
		this.emit("_outbound", name, data)
		this.socket.send(JSON.stringify([name, data]))
	}

}
