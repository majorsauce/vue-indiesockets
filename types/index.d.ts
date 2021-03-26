// Augment vue interface
import _Vue from "vue"
import { IndieSocketClient } from "./IndieSocketClient"
export { IndieSocket } from "./IndieSocket"
export { IndieSocketServer } from "./IndieSocketServer";
export { IndieSocketClient } from "./IndieSocketClient";

declare class SocketHandler<V> {
	_all: (this: V, ...args: any[]) => void | undefined
	_io: (this: V, ...args: any[]) => void | undefined
	_in: (this: V, ...args: any[]) => void | undefined
	_out: (this: V, ...args: any[]) => void | undefined
	_connected: (this: V, ...args: any[]) => void | undefined
	_close: (this: V, ...args: any[]) => void | undefined
	_error: (this: V, ...args: any[]) => void | undefined
	[event: string]: (this: V, ...args: any[]) => void | undefined
}

declare module 'vue/types/vue' {
	interface VueConstructor {
		$socket: {
			send(id: string, ...args: any[]): void
		}
	}
}

declare module 'vue/types/options' {
	interface ComponentOptions<V extends _Vue> {
		sockets?: SocketHandler<V>
	}
}

declare module "vue-indiesockets/types/IndieSocketClient" {
	interface IndieSocketClient {
		on(event: "_all" | "_error" | "_closed" | "_out" | "_in" | "_io", listener: (...args: any[]) => void): this;
		on(event: string, listener: (...args: any[]) => void): this;
	}
}

declare module "vue-indiesockets/types/IndieSocketServer" {
	interface IndieSocketServer {
		on(event: "_connected", listener: (client: IndieSocketClient) => void): this;
	}
}

