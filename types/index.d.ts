// Augment vue interface
import _Vue from "vue"
import { IndieSocketClient } from "./IndieSocketClient"
export { IndieSocket } from "./IndieSocket"
export { IndieSocketServer } from "./IndieSocketServer"
export { IndieSocketClient } from "./IndieSocketClient"

declare class SocketHandler<V> {
	[id: string]: (this: V, ...args: any[]) => void
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
		on(event: "_*" | "_error" | "_disconnect" | "_outbound", listener: (...args: any[]) => void): this;
		on(event: string, listener: (...args: any[]) => void): this;
	}
}

declare module "vue-indiesockets/types/IndieSocketServer" {
	interface IndieSocketServer {
		on(event: "_connected" | string, listener: (client: IndieSocketClient) => void): this;
	}
}

