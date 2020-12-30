import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import Home from "./home";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
import { MutableRefObject, useEffect, useRef } from "react";
config.autoAddCss = false; /* eslint-disable import/first */

// Somewhere in your `index.ts`:
setChonkyDefaults({ iconComponent: ChonkyIconFA });

export default function App() {
    const webSocket: MutableRefObject<WebSocket> = useRef(null);

    useEffect(() => {
        // effect
        webSocket.current = new WebSocket("ws://localhost:5000/ws");
        webSocket.current.onmessage = (message) => {
            console.log(message);
        };
        return () => {
            // cleanup
            webSocket.current.close();
        };
    }, []);

    return (
        <>
            <div>
                <button
                    onClick={() => {
                        if (webSocket.current !== null) {
                            webSocket.current.send("Hello");
                        }
                    }}
                >
                    SendMessage
                </button>
            </div>
            <Home />
        </>
    );
}
