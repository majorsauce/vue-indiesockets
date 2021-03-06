# IndieSockets-Plugin for Vue and your Backend
This plugin is inspired by [vue-socket.io-extended](https://www.npmjs.com/package/vue-socket.io-extended)


### About

vue-indiesockets adds WebSocket capabilities to your backend and Vue directly in Vue components.
It provides a thin wrapper around both client- and serverside WebSocket implementations handling all the logic required to send and receive data in real-time applications. It does not build on top of SocketIO (although it probably could) so there is no failover capability if Websockets are not supported by the client.

On the backend side you have to pass an Websocket instance to the plugin. I developed it using [ws](https://www.npmjs.com/package/ws) but other implementations should work as well. 

<br>

### Installation

Install on both, server and client

```
npm install vue-indiesockets
```

<br>
<br>

### Usage

<br>

#### Server-Side:


```js
// This is specific to the implementation you want to use
import WebSocket from "ws"
// Import the Server and Client types
import {IndieSocketServer, IndieSocketClient} from "vue-indiesockets"

// Initialize IndieSocketServer by passing the Websocket-Server as argument
const server = new IndieSocketServer(new WebSocket.Server({
	port: 40001
}), true)

// Initialize your listeners
server.on("_connected", (client: IndieSocketClient) => {
	
    // Send a message to the client
    client.send("hello", "Hallo Client!")
    // You can also send objects (Using JSON.stringify and JSON.parse internally so functions will be lost)
    client.send("showInfo", {message: "my info message", color: "green", timeout: 1000})

    // Catch all messages using _*. (this gives you the message and the data as parameters)
	// Does not prevent other handlers to be called, so hello would be called and then _* would be called afterwards with one inbound message
    client.on("_*", (message, data) => {
        console.log("Inbound: " + message + " with data " + JSON.stringify(data))
    })

    // Custom message handler
    client.on("login", data => console.log("Client sent login: " + data.username))

    // Will be called for every outbound message, useful if you want to log the outbound traffic
    client.on("_outbound", data => {
        console.log("outbound: " + data)
    })
    
    client.on("_error", e => console.error(e))
    
    client.on("_disconnect", () => console.log("Client disconnected"))
    
})
```

<br>
<br>

#### Client side (vue):

<br>

**main.ts**

```js
// main.ts
import { IndieSocket } from "vue-indiesockets"

// Tell Vue to install the plugin.
// Only has options debug and autoReconnect for now. AutoReconnect defaults to true, debug to false
Vue.use(new IndieSocket(), "ws://localhost:40001", {debug: true, autoReconnect: true})
```

<br>

**cusom component**

```html
<template>
    <div>
        <!-- You can use this.$socket.connected to check if the websocket is currently connected -->
        <p>Connected: {{this.$socket.connected}}</p>
        <p>{{this.message}}</p>
    </div>
</template>

<script>
export default {
    data: () => ({
        message: "",
    }),
    // Add the sockets object to your component and add handlers in there
    sockets: {
        // Custom handler called when the server does client.send("hello", "hello client!")
        hello(data) {
            this.message = data;
            // Send something back to the server
            this.$socket.send("hallo", "Hello Server!")
        }
    }
};
</script>
```


