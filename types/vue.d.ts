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
