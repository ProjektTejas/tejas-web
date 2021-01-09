import { DownCircleOutlined, DownCircleTwoTone } from "@ant-design/icons";
import {
    Button,
    Col,
    Descriptions,
    Divider,
    Input,
    Row,
    Typography,
} from "antd";
import Title from "antd/lib/typography/Title";
import axios from "axios";
import { useEffect, useState } from "react";
import { TEJAS_API_V1 } from "../lib/tejasEndpoints";

const { Link } = Typography;

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.get["Access-Control-Allow-Origin"] = "*";

interface Props {
    showModal: any;
    mainTaskId;
}

const Download = (props: Props) => {
    const [taskId, setTaskId] = useState("");
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState("");

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
                    <Button
                        type="primary"
                        icon={<DownCircleOutlined />}
                        loading={loading}
                        onClick={async () => {
                            setLoading(true);
                            try {
                                const results = await axios.get(
                                    `${TEJAS_API_V1}/train/download_model`,
                                    {
                                        params: {
                                            task_id: taskId,
                                        },
                                    }
                                );

                                console.log(results);
                                console.log(results.data);
                                setDownloadUrl(results.data["download_url"]);

                                // download this file
                                const newWindow = window.open(
                                    results.data["download_url"],
                                    "_blank",
                                    "noopener,noreferrer"
                                );
                                if (newWindow) newWindow.opener = null;
                            } catch (e) {}

                            setLoading(false);
                        }}
                    >
                        Download
                    </Button>
                </Col>
            </Row>
            {downloadUrl !== "" && (
                <>
                    <Divider />
                    <Row>
                        <Col span={24}>
                            <Descriptions bordered>
                                <Descriptions.Item label="Download URL">
                                    <Link href={downloadUrl}>
                                        {downloadUrl}
                                    </Link>
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default Download;
