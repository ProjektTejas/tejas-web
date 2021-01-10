import { Col, Menu, Row } from "antd";
import { Header as AHeader } from "antd/lib/layout/layout";
import Head from "next/head";

const Header: React.FC = () => {
    return (
        <>
            <Head>
                <title>Tejas.AI</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="152x152"
                    href="/favicon/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon/favicon-16x16.png"
                />
                <link rel="manifest" href="/favicon/site.webmanifest" />
                <link
                    rel="mask-icon"
                    href="/favicon/safari-pinned-tab.svg"
                    color="#5bbad5"
                />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <AHeader style={{ padding: "0px 100px" }}>
                <div style={{ float: "left" }}>
                    <div data-uk-grid>
                        <div>
                            <img src="/logo.svg" height={40} width={40} />
                        </div>
                        <div
                            style={{
                                color: "#ecf0f1",
                                padding: "5px 10px",
                                fontFamily: "IBM Plex Mono",
                                fontSize: "2em",
                                fontWeight: "bold",
                            }}
                        >
                            Tejas.AI
                        </div>
                    </div>
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={["1"]}
                    style={{
                        float: "right",
                    }}
                >
                    <Menu.Item key="1">Home</Menu.Item>
                    <Menu.Item key="2">About</Menu.Item>
                </Menu>
            </AHeader>
        </>
    );
};

export default Header;
