export { IndieSocketServer } from "./IndieSocketServer"
export { IndieSocketClient } from "./IndieSocketClient"

class Socket {

	ws: WebSocket | undefined = undefined
	listeners: Map<string, { vm: unknown; callback: Function }[]> = new Map()
	private _connected: boolean = false
	url: string
	responsiveStore: any
	options = { debug: false, autoReconnect: true }
	public get connected() {
		return this.responsiveStore.connected
	}

	constructor(vue: any, url: string, options: {}) {
		this.url = url
		this.options = { ...this.options, ...options }
		this.responsiveStore = new vue({
			data: () => ({
				connected: false as boolean
			})
		})

		this._init(url)
	}

	_init(url: string) {
		this.ws = new WebSocket(url)
		this.ws.onopen = () => {
			if (this.options.debug) console.log("[IndieSocket] Connected to " + url)
			this.listeners.get("_connected")?.forEach((listener: any) => listener.callback.call(listener.vm))
			this.listeners.get("_all")?.forEach((listener: any) => listener.callback.call(listener.vm))
			this.responsiveStore.connected = true
		}
		this.ws.onclose = () => {
			if (this.options.debug) console.log("[IndieSocket] Disconnected")
			this.responsiveStore.connected = false
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
	options = {} as any

	constructor(url: string, options?: { debug?: boolean, autoReconnect?: boolean }) {
		this.url = url
		this.options = options || {}
	}

	// eslint-disable-next-line
	install(vue: any) {
		try {
			const socket = new Socket(vue, this.url, this.options)
			vue.prototype.$socket = socket
			if (socket.options.debug) console.log("[IndieSocket] Vue initialization started for " + this.url)

			vue.mixin({
				created() {
					const handlers = this.$options.sockets || {}
					for (const key in handlers)
						if (typeof handlers[key] === 'function') {
							this.$socket.addListener(this, key, handlers[key])
							if (this.$socket.options.debug) console.log("[IndieSocket] Registered handler " + key)
						}
				},
			})
		} catch (e) {
			console.log(e)
		}
	}

}
