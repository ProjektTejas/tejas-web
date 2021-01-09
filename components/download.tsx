import { DownCircleOutlined, DownCircleTwoTone } from "@ant-design/icons";
import { Button, Col, Divider, Input, Row } from "antd";
import Title from "antd/lib/typography/Title";
import { useEffect, useState } from "react";

interface Props {
    showModal: any;
    mainTaskId;
}

const Download = (props: Props) => {
    const [taskId, setTaskId] = useState("");

    useEffect(() => {
        // effect
        setTaskId(props.mainTaskId);
        return () => {
            // cleanup
        };
    }, [props.mainTaskId]);

    return (
        <div>
            <Title
                style={{
                    textAlign: "center",
                    fontFamily: "IBM Plex Mono",
                    fontSize: "4em",
                }}
            >
                Download
            </Title>
            <Divider dashed />
            <Row>
                <Col span={20}>
                    <Input
                        addonBefore="Enter Task ID"
                        value={taskId}
                        onChange={(e) => {
                            setTaskId(e.target.value);
                        }}
                    />
                </Col>
                <Col span={4}>
                    <Button type="primary" icon={<DownCircleOutlined />}>
                        Download
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default Download;
