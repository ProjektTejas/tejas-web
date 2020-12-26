import Layout from "../components/core/layout";
import Sidebar from "../components/core/sidebar";
import { Layout as ALayout } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";

import { Header as AHeader } from "antd/lib/layout/layout";
import Header from "../components/core/header";
import Footer from "../components/core/footer";
import { VFSBrowser } from "../components/file-manager/VFSBrowser";

interface Props {}

const Home = (props: Props) => {
    const files = [
        { id: "lht", name: "Projects", isDir: true },
        {
            id: "mcd",
            name: "chonky-sphere-v2.png",
            thumbnailUrl: "https://chonky.io/chonky-sphere-v2.png",
        },
    ];
    const folderChain = [{ id: "xcv", name: "Demo", isDir: true }];

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
            <Layout>
                <Content
                    style={{
                        padding: "24px",
                        minHeight: 280,
                    }}
                >
                    <VFSBrowser />
                </Content>
            </Layout>
        </>
    );
};

export default Home;
