import {EventEmitter} from "events"

export class IndieSocketClient extends EventEmitter {

	socket: any
	debug: boolean

	constructor(socket: any, debug: boolean = false) {
		super()
		this.socket = socket
		this.debug = debug

		this.socket.on("message", (message: string) => {
			const [event, data] = JSON.parse(message)
			if (this.debug) console.log("[IndieSocket] Inbound message: " + event + " with value " + JSON.stringify(data))
			this.emit(event, ...data)
			if (event !== "_in") this.emit("_in", event, ...data)
			if (event !== "_io") this.emit("_in", event, ...data)
			if (event !== "_all") this.emit("_*", event, ...data)
		})

		this.socket.on("close", () => {
			if (this.debug) console.log("[IndieSocket] Client disconnected")
			this.emit("_closed")
			this.emit("_all")
		})

		this.socket.on("error", (e: Error) => {
			if (this.debug) console.log("[IndieSocket] Error occured: " + e)
			this.emit("_error", e)
			this.emit("_all", e)
		})
	}

	// eslint-ignore-next-line
	send(event: string, data?: any) {
		if (this.debug) console.log("[IndieSocket] Outbound message: " + event + " with value " + JSON.stringify(data))
		this.emit("_out", event, data)
		this.emit("_io", event, data)
		this.emit("_all", event, data)
		this.socket.send(JSON.stringify([event, data]))
	}

}
