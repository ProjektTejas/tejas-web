import { Layout, Menu } from "antd";
import Sider from "antd/lib/layout/Sider";

import {
    BulbOutlined,
    ApartmentOutlined,
    DatabaseOutlined,
    RocketOutlined,
    ExperimentOutlined,
    DownCircleOutlined,
} from "@ant-design/icons";

import { useState } from "react";

const Sidebar = ({ width }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(collapsed) => setCollapsed(collapsed)}
            width={width}
            style={{
                backgroundColor: "white",
                padding: "30px 0",
                overflow: "auto",
            }}
        >
            <Menu mode="inline" style={{ height: "100%" }}>
                <Menu.Item key="1" icon={<BulbOutlined />}>
                    Introduction
                </Menu.Item>
                <Menu.Item key="2" icon={<ApartmentOutlined />}>
                    Model
                </Menu.Item>
                <Menu.Item key="3" icon={<DatabaseOutlined />}>
                    Dataset
                </Menu.Item>
                <Menu.Item key="4" icon={<RocketOutlined />}>
                    Training
                </Menu.Item>
                <Menu.Item key="5" icon={<ExperimentOutlined />}>
                    Inference
                </Menu.Item>
                <Menu.Item key="6" icon={<DownCircleOutlined />}>
                    Download
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
