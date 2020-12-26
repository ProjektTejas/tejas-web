import { Layout as ALayout } from "antd";
import { Content as AContent } from "antd/lib/layout/layout";

import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";

const Layout: React.FC = ({ children }) => {
    return (
        <ALayout>
            <Header />
            <ALayout style={{ minHeight: "93vh" }}>
                <Sidebar width={200} />
                <ALayout>
                    {children}
                    <Footer />
                </ALayout>
            </ALayout>
        </ALayout>
    );
};

export default Layout;
