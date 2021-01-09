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

const Sidebar = ({ width, currentStep, setCurrentStep }) => {
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
            <Menu
                mode="inline"
                style={{ height: "100%" }}
                selectedKeys={[currentStep]}
                defaultSelectedKeys={[currentStep]}
                onClick={(e) => setCurrentStep(e.key)}
            >
                <Menu.Item key="introduction" icon={<BulbOutlined />}>
                    Introduction
                </Menu.Item>
                <Menu.Item key="model" icon={<ApartmentOutlined />}>
                    Model
                </Menu.Item>
                <Menu.Item key="dataset" icon={<DatabaseOutlined />}>
                    Dataset
                </Menu.Item>
                <Menu.Item key="training" icon={<RocketOutlined />}>
                    Training
                </Menu.Item>
                <Menu.Item key="inference" icon={<ExperimentOutlined />}>
                    Inference
                </Menu.Item>
                <Menu.Item key="download" icon={<DownCircleOutlined />}>
                    Download
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
