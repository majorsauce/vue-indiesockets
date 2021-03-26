export { IndieSocketServer } from "./IndieSocketServer"
export { IndieSocketClient } from "./IndieSocketClient"

class Socket {

	ws: WebSocket | undefined = undefined
	listeners: Map<string, { vm: unknown; callback: Function }[]> = new Map()
	connected: boolean = false
	url: string
	options = { debug: false, autoReconnect: true }

	constructor(url: string, options: {}) {
		this.url = url
		this.options = { ...this.options, ...options }

		this._init(url)
	}

	_init(url: string) {
		this.ws = new WebSocket(url)
		this.ws.onopen = () => {
			if (this.options.debug) console.log("[IndieSocket] Connected to " + url)
			this.listeners.get("_connected")?.forEach((listener: any) => listener.callback.call(listener.vm))
			this.listeners.get("_all")?.forEach((listener: any) => listener.callback.call(listener.vm))
			this.connected = true
		}
		this.ws.onclose = () => {
			if (this.options.debug) console.log("[IndieSocket] Disconnected")
			this.connected = false
			this.listeners.get("_closed")?.forEach((listener: any) => listener.callback.call(listener.vm))
			this.listeners.get("_all")?.forEach((listener: any) => listener.callback.call(listener.vm))
			this.reconnect()
		}
		this.ws.onmessage = (message) => {
			const [event, data] = JSON.parse(message.data)
			if (this.options.debug) console.log("[IndieSocket] Inbound message: " + event + " with value " + JSON.stringify(data))
			this.listeners.get(event)?.forEach((listener: any) => listener.callback.call(listener.vm, data))
			this.listeners.get("_in")?.forEach((listener: any) => listener.callback.call(listener.vm, data))
			this.listeners.get("_io")?.forEach((listener: any) => listener.callback.call(listener.vm, data))
			this.listeners.get("_all")?.forEach((listener: any) => listener.callback.call(listener.vm, data))
		}
		this.ws.onerror = (e) => {
			if (this.options.debug) console.log("[IndieSocket] Error " + JSON.stringify(e))
			this.listeners.get("_error")?.forEach((listener: any) => listener.callback.call(listener.vm, e))
			this.listeners.get("_all")?.forEach((listener: any) => listener.callback.call(listener.vm, e))
			this.reconnect()
		}
	}

	reconnect() {
		if (this.options.autoReconnect != true || this.ws?.readyState != 3) return
		if (this.options.debug) console.log("[IndieSocket] Trying to reconnect to " + this.url)
		this.ws = undefined
		this._init(this.url)
	}

	addListener(vm: unknown, key: string, callback: Function) {
		if (this.options.debug) console.log("[IndieSocket] Adding listener for messsage " + key)
		if (!this.listeners.has(key)) this.listeners.set(key, [])
		this.listeners.get(key)?.push({ vm: vm, callback: callback })
	}

	// eslint-disable-next-line
	send(name: string, ...data: any[]) {
		if (this.options.debug) console.log("[IndieSocket] Outbound message: " + name + " with value " + JSON.stringify(data))
		this.ws?.send(JSON.stringify([name, data]))
		this.listeners.get("_out")?.forEach((listener: any) => listener.callback.call(listener.vm, data))
		this.listeners.get("_io")?.forEach((listener: any) => listener.callback.call(listener.vm, data))
		this.listeners.get("_all")?.forEach((listener: any) => listener.callback.call(listener.vm, data))
	}

}

export class IndieSocket {

	url: string
	options = {}

	constructor(url: string, options?: { debug?: boolean, autoReconnect?: boolean }) {
		this.url = url
		this.options = options || {}
	}

	// eslint-disable-next-line
	install(Vue: any) {
		try {
			Vue.prototype.$socket = new Socket(this.url, this.options)
			console.log("[IndieSocket] Vue initialization started for " + this.url)

			Vue.mixin({
				created() {
					this.$options.sockets = this.$options.sockets || {}
					for (const [key, value] of this.$options.sockets) {
						if (typeof value === 'function') this.$socket.addListener(this, key, value)
					}
				},
			})
		} catch (e) {
			console.log(e)
		}
	}

}
