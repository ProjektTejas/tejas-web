import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                {/* <!-- UIkit CSS --> */}
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/uikit@3.6.5/dist/css/uikit.min.css"
                />

                {/* <!-- UIkit JS --> */}
                <script src="https://cdn.jsdelivr.net/npm/uikit@3.6.5/dist/js/uikit.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/uikit@3.6.5/dist/js/uikit-icons.min.js"></script>
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
