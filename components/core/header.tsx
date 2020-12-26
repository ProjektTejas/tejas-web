import { Col, Menu, Row } from "antd";
import { Header as AHeader } from "antd/lib/layout/layout";
import Head from "next/head";

const Header: React.FC = () => {
    return (
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
    );
};

export default Header;
