<<<<<<< HEAD
import _Vue from 'vue';

type SocketHandler<V> = {
	[key: string]: (this: V, ...args: any[]) => void
};

declare module 'vue/types/options' {
	interface ComponentOptions<V extends _Vue> {
		sockets?: SocketHandler<V>
	}
}

declare module 'vue/types/vue' {
	interface Vue {
		$socket: {
			connected: boolean;
		};
	}
}
=======
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
>>>>>>> 411bed8a49cbc5dc9867cafc766b7d0ceb040086
