import {
    DoubleRightOutlined,
    RightCircleOutlined,
    RightOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Row,
    Select,
    Table,
} from "antd";
import Title from "antd/lib/typography/Title";
import Image from "next/image";

const { Meta } = Card;
const { Option } = Select;

interface Props {
    showModal: any;
    setCurrentStep;
}

const Model = (props: Props) => {
    return (
        <div>
            <Row justify="center">
                <Col span={24}>
                    <Title
                        style={{
                            textAlign: "center",
                            fontFamily: "IBM Plex Mono",
                            fontSize: "4em",
                        }}
                    >
                        Model
                    </Title>
                </Col>
                <Divider dashed />
                <Col span={24}>
                    <Row justify="space-around">
                        <Col span={10}>
                            <Card>
                                <Row
                                    justify="center"
                                    style={{ alignItems: "center" }}
                                >
                                    <Col span={6}>
                                        <Image
                                            src="/icons/deep-learning.svg"
                                            width={100}
                                            height={100}
                                        />
                                    </Col>
                                    <Col span={16}>
                                        <Meta
                                            title="MobileNetV2"
                                            style={{ textAlign: "center" }}
                                        />
                                        <Divider dashed />
                                        <Descriptions
                                            bordered
                                            column={{
                                                xxl: 1,
                                                xl: 1,
                                                lg: 1,
                                                md: 1,
                                                sm: 1,
                                                xs: 1,
                                            }}
                                        >
                                            <Descriptions.Item label="Parameters">
                                                6.9M
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Model Type">
                                                Classifier
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Release Year">
                                                2018
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={10}>
                            <Card>
                                <Meta title="Select a Model" />
                                <Divider dashed />
                                <Select
                                    style={{ minWidth: "80%" }}
                                    defaultValue="mobilenet_v2"
                                >
                                    <Option value="mobilenet_v2">
                                        MobileNet V2
                                    </Option>
                                </Select>
                                <Divider dashed />
                                <Button
                                    type="primary"
                                    icon={<RightCircleOutlined />}
                                    onClick={() => {
                                        props.setCurrentStep("dataset");
                                    }}
                                >
                                    Upload Dataset
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default Model;
