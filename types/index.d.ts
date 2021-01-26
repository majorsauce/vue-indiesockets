// Augment vue interface
import _Vue from "vue"

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

// Augment EventEmitter
declare module "events" {
	interface EventEmitter {
		on(type: "_connected", listener: any): this;
	}
}
