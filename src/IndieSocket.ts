export {IndieSocketServer} from "./IndieSocketServer"
export {IndieSocketClient} from "./IndieSocketServer"

class Socket {

	ws: WebSocket | undefined = undefined
	listeners: Map<string, { vm: unknown; callback: Function }[]> = new Map()
	connected: boolean = false
	url: string
	options: { debug: boolean, autoReconnect: boolean }

	constructor(url: string, options: { debug: boolean, autoReconnect: boolean }) {
		this.url = url
		this.options = options

		this._init(url, options)
	}

	_init(url: string, options: { debug: boolean, autoReconnect: boolean }) {
		this.ws = new WebSocket(url)
		this.ws.onopen = () => {
			if (this.options.debug) console.log("[IndieSocket] Connected to " + url)
			this.connected = true
		}
		this.ws.onclose = () => {
			if (this.options.debug) console.log("[IndieSocket] Disconnected")
			this.connected = false
			this.reconnect()
		}
		this.ws.onmessage = (e) => {
			const [name, data] = JSON.parse(e.data)
			if (this.options.debug) console.log("[IndieSocket] Inbound message: " + name + " with value " + JSON.stringify(data))
			this.listeners.get(name)?.forEach((listener: any) => listener.callback.call(listener.vm, data))
		}
		this.ws.onerror = (e) => {
			if (this.options.debug) console.log("[IndieSocket] Error " + JSON.stringify(e))
			this.listeners.get("_error")?.forEach((listener: any) => listener.callback.call(listener.vm, e))
			this.reconnect()
		}
	}

	reconnect() {
		if (this.options.autoReconnect != true || this.ws?.readyState != 3) return
		if (this.options.debug) console.log("[IndieSocket] Trying to reconnect to " + this.url)
		this.ws = undefined
		this._init(this.url, this.options)
	}

	addListener(vm: unknown, key: string, callback: Function) {
		if (this.options.debug) console.log("[IndieSocket] Adding listener for messsage " + key)
		if (!this.listeners.has(key)) this.listeners.set(key, [])
		this.listeners.get(key)?.push({ vm: vm, callback: callback })
	}

	// eslint-disable-next-line
	send(name: string, data: any) {
		if (this.options.debug) console.log("[IndieSocket] Outbound message: " + name + " with value " + JSON.stringify(data))
		this.ws?.send(JSON.stringify([name, data]))
	}

}

export class IndieSocket {

	// eslint-disable-next-line
	install(Vue: any, url: string, options: {debug: boolean, autoReconnect: boolean} = {debug: true, autoReconnect: true}) {
		Vue.prototype.$socket = new Socket(url, options)
		console.log("[IndieSocket] Initializing for " + url + " with debug " + (options.debug ? "enabled" : "disabled"))

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
