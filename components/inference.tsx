import { InboxOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Image, Input, Row, Table, Upload } from "antd";
import Title from "antd/lib/typography/Title";
import axios from "axios";
import { useState } from "react";

const { Dragger } = Upload;

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

interface ClassifyResults {
    class_idx: number;
    class_name: string;
    confidence: number;
}

interface Props {
    showModal: any;
}

const Inference = (props: Props) => {
    const [imageFile, setImageFile] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [taskId, setTaskId] = useState("");

    const resultsColumns = [
        {
            title: "class_idx",
            dataIndex: "class_idx",
            key: "class_idx",
        },
        {
            title: "class_name",
            dataIndex: "class_name",
            key: "class_name",
        },
        {
            title: "confidence",
            dataIndex: "confidence",
            key: "confidence",
        },
    ];

    const [resultsData, setResultsData] = useState([]);

    return (
        <div>
            <Title
                style={{
                    textAlign: "center",
                    fontFamily: "IBM Plex Mono",
                    fontSize: "4em",
                }}
            >
                Inference
            </Title>

            <Divider dashed />
            <Row justify="space-around" style={{ textAlign: "center" }}>
                <Col span={10}>
                    <Row>
                        <Col span={24}>
                            <Input
                                addonBefore="Enter Task ID"
                                value={taskId}
                                onChange={(e) => {
                                    setTaskId(e.target.value);
                                }}
                            />
                        </Col>
                    </Row>
                    <Divider />
                    <Row>
                        <Col span={24}>
                            <Dragger
                                multiple={false}
                                onChange={(info) => {
                                    // console.log(info.file);
                                }}
                                showUploadList={false}
                                customRequest={({
                                    onError,
                                    onSuccess,
                                    file,
                                }) => {
                                    console.log(file);
                                    setImageFile(file);
                                    setResultsData([]);
                                }}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    Click or drag file to this area to upload
                                </p>
                                <p className="ant-upload-hint">
                                    Upload an Image file to perform Inferencing
                                    on
                                </p>
                            </Dragger>
                        </Col>
                    </Row>
                </Col>
                <Col span={10}>
                    {imageFile !== undefined && (
                        <>
                            <Image src={URL.createObjectURL(imageFile)} />
                            <Divider />
                            <Button
                                type="primary"
                                loading={loading}
                                icon={<RightCircleOutlined />}
                                onClick={async () => {
                                    setLoading(true);

                                    let formData = new FormData();
                                    formData.append(
                                        "task_id",
                                        "1f97675d-e04c-445b-bddd-7f7ff18cdd7b"
                                    );
                                    formData.append("file", imageFile);

                                    try {
                                        const results = await axios.post(
                                            "https://u7stad9b0b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/classify/classify_image",
                                            formData
                                        );

                                        console.log(results);

                                        const classfyResults: Array<ClassifyResults> =
                                            results.data;

                                        let toSetResultData = [];

                                        classfyResults.forEach((val, idx) => {
                                            toSetResultData.push({
                                                key: idx.toString(),
                                                class_idx: val.class_idx,
                                                class_name: val.class_name,
                                                confidence: val.confidence,
                                            });
                                        });

                                        setResultsData(toSetResultData);
                                    } catch (e) {
                                        console.log(e);
                                    }

                                    setLoading(false);
                                }}
                            >
                                Classify
                            </Button>
                        </>
                    )}
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col span={24}>
                    <Table
                        dataSource={resultsData}
                        columns={resultsColumns}
                        pagination={{ pageSize: 5 }}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default Inference;
