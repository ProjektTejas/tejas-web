import { Menu, Layout, Image } from "antd";
import styles from "../styles/Home.module.css";
import styled from "styled-components";
import Head from "next/head";
import { ChonkyActions, setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";

import { FullFileBrowser } from "chonky";

// Somewhere in your `index.ts`:
setChonkyDefaults({ iconComponent: ChonkyIconFA });

const { Header, Content, Footer } = Layout;

const Logo = styled(Image)`
    float: left;
    width: 80px;
    height: 80px;
    margin: 16px 24px 16px 0;
    background: transparent;
`;

export default function Home() {
    const files = [
        { id: "lht", name: "Projects", isDir: true },
        {
            id: "mcd",
            name: "chonky-sphere-v2.png",
            thumbnailUrl: "https://chonky.io/chonky-sphere-v2.png",
        },
    ];
    const folderChain = [{ id: "xcv", name: "Demo", isDir: true }];

    const myFileActions = [
        ChonkyActions.UploadFiles,
        ChonkyActions.DownloadFiles,
    ];

    return (
        <div>
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
            <div style={{ height: 300 }}>
                <FullFileBrowser
                    files={files}
                    folderChain={folderChain}
                    fileActions={myFileActions}
                />
            </div>
            );
        </div>
    );
    return (
        <Layout className="layout">
            <Header>
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
            </Header>

            <Content style={{ padding: "25px" }}>
                <div className={styles["site-layout-content"]}>Content</div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
                Ant Design ©2018 Created by Ant UED
            </Footer>
        </Layout>
    );
}
