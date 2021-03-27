import { EventEmitter } from "events"
import { IndieSocketClient } from "./IndieSocketClient"

export class IndieSocketServer extends EventEmitter {

	debug: boolean

	constructor(server: any, debug: boolean = false) {
		super()
		this.debug = debug
		server.on("connection", (socket: any) => {
			if(debug) console.log("[IndieSocket] Client connected")
			const client = new IndieSocketClient(socket, debug)
			this.emit("_connected", client)
			this.emit("_all", client)
		})
	}

}


