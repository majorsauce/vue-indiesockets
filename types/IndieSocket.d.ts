export { default as IndieSocketClient } from "./IndieSocketClient";
export { default as IndieSocketServer } from "./IndieSocketServer";
import "../types/vue";
export declare class IndieSocket {
    install(Vue: any, url: string, options?: {
        debug: boolean;
        autoReconnect: boolean;
    }): void;
}
