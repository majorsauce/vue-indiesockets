# Websocket wrapper for Vue (Client) and NodeJS (Server)
🤟 This plugin is inspired by [vue-socket.io-extended](https://www.npmjs.com/package/vue-socket.io-extended)


## About

vue-indiesockets adds WebSocket capabilities to your Vue components and your NodeJS backend.
It provides a thin wrapper around both client- and serverside WebSocket implementations handling all the logic required to send and receive data in real-time applications. It does NOT build on top of SocketIO (although it probably could) so there is no failover capability if Websockets are not supported by the client.

## Installation

It´s the same package for both, server and client
```
npm install vue-indiesockets
```


## Usage

###Server side 

On the backend side you have to pass an Websocket instance to the plugin. I developed it using [ws](https://www.npmjs.com/package/ws) but other implementations should work as well. 

```js
import {IndieSocketServer, IndieSocketClient} from "vue-indiesockets"
import WebSocket from "ws"

const server = new IndieSocketServer(new WebSocket.Server({
	port: 40001
}), false)

server.on("_connected", (client: IndieSocketClient) => {

	client.send("text", "Your cart:")
	client.send("cart", {total: 15.99, items: ["'1x IndieCodings rocks' shirt", "'2x Just kidding' cup"]})

	client.on("buy", (items) => {
		client.send("text", `Thank you for your order. Your ${items.length} items will arrive soon!`)
		client.send("cart", {total: 0, items: []})
	})

	client.on("_in", (data) => console.log("From client: " + data))

})
```

<br>
<br>

### Client side (vue):

<br>

**main.ts**

```js
import {IndieSocket} from "vue-indiesockets"

Vue.use(new IndieSocket("ws://localhost:40001", {debug: false, autoReconnect: true}))
```

<br>

**custom component**

```html
<template>
	<v-app>
	
		<p>Connected: {{ this.$socket.connected }}</p>
		<p>{{ chat }}</p>
		<input v-model="chatMessage" />
		<button v-if="cart.items.length > 0" @click="$socket.send('message', chatMessag)"> Send </button>
	
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	data: () => ({
		chatMessag: "",
		messages: []
	}),
	sockets: {
		chat(message) {
			this.$data.chat.push(message);
			this.$socket.send("seen", message.id)
		}
	}
});
</script>

```


## ❓ Docs

*** Handlers (Vue and NodeJS) ***

| Socket handler | Description | 
| ------------- |-------------| 
| _connected | Websocket connected | 
| _error | Error occured | 
| _in | On every inbound message |
| _out | On every outbound message |
| _io | On every inbound and outbound message |
| _all | Handles every event (in, out, error, connected, ect.)  |
| _close | When WebSocket connection is closed |
| {customHandlerName} | Your custom handler. Called on appropriate inbound event |

<br>
<br>
*** Socket (Vue) ***

The `$socket` object is available in vue on every vue instance. 

| Function | Description |
|---|---|
|send(event: string, ...data: any)|Sends data to the other party. Event defines which handler is called, data is what you want to pass*| 

<br>
<br>

***IndieSocketClient (NodeJS)***
The `IndieSocketClient` is the counterpart to the $socket object in the Vue version.

| Function | Description |
|---|---|
|send(event: string, ...data: any)|Sends data to the other party. Event defines which handler is called, data is what you want to pass*|

<br>
<br>

## ❗ Appendix
* The data can be anything. It is converted to JSON and back automatically. Please be aware that functions of an object get lost in this process 
