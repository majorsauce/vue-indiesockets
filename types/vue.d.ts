// Augment vue interface
import _Vue from "vue"

declare class SocketHandler<V> {
	[id: string]: [this: V, ...args: any[]]
}

declare module 'vue/types/vue' {
	interface VueConstructor {
		$socket: {
			send(id: string, ...args: any[]): void
		}
	}
}

declare module 'vue/types/options' {
	interface ComponentOptions<V extends Vue> {
		sockets?: SocketHandler<V>[]
	}
}