export {IndieSocketServer} from "./IndieSocketServer"
export {IndieSocketClient} from "./IndieSocketServer"

class Socket {

	ws: WebSocket
	listeners: Map<string, { vm: unknown; callback: Function }[]> = new Map()

	constructor(url: string) {
		console.log("Trying to connect to " + url)

		this.ws = new WebSocket(url)
		this.ws.onopen = () => {
			console.log("Websocket connected")
		}
		this.ws.onclose = () => {
			console.log("Websocket closed")
		}
		this.ws.onmessage = (e) => {
			const [name, ...args] = JSON.parse(e.data)
			console.log("Inbound message " + name + ": " + JSON.stringify(args))
			this.listeners.get(name)?.forEach((listener: any) => listener.callback.call(listener.vm, args[0] || args))
		},
			this.ws.onerror = (e) => {
				console.error(e)
			}
	}

	addListener(vm: unknown, key: string, callback: Function) {
		if (!this.listeners.has(key)) this.listeners.set(key, [])
		this.listeners.get(key)?.push({ vm: vm, callback: callback })
	}

	// eslint-disable-next-line
	send(name: string, ...data: any) {
		this.ws.send(JSON.stringify([name, data]))
	}

}

export class IndieSocket {

	components: [] = []

	// eslint-disable-next-line
	install(Vue: any, url: string) {
		Vue.prototype.$socket = new Socket(url)

		Vue.mixin({
			created() {
				this.$options.sockets = this.$options.sockets || {}
				for (const key of Object.keys(this.$options.sockets)) {
					if (typeof this.$options.sockets[key] !== 'function') continue
					this.$socket.addListener(this, key, this.$options.sockets[key])
				}
			}
		})
	}

}
