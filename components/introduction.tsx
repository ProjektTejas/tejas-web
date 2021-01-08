import { Button, Card, Col, Divider, Row, Steps, Typography } from "antd";
import { useState } from "react";
import AnimatedFire from "./fun-stuff/fire";

import Image from "next/image";
import { RightCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;
interface Props {
    showModal: any;
}

const stepData = [
    {
        title: "The Model",
        image: "/icons/ai.svg",
        text:
            "Model is the heart and core of the task, Tejas.AI provides you classification models as of now, and specifically MobileNetV2 but we are in the process of adding more models 😀",
    },
    {
        title: "The Dataset",
        image: "/icons/photo.svg",
        text:
            "We currently only support ImageFolder dataset, but further will be adding text support as well. At max you can upload 10 classes and 100 images in total for classification. Heads up ! your dataset is really important for the model, make sure to give some good quality dataset.",
    },
    {
        title: "Training",
        image: "/icons/startup.svg",
        text:
            "Now that you have chosen a model and given us a dataset to work with, it'll be our responsibility to train a model on the dataset and setup everything in our backend, we can assure you we try our best to create the best model possible.",
    },
    {
        title: "Inference",
        image: "/icons/experiment.svg",
        text:
            "Now that we also have the model ready, you can test out your model ! upload some image and let us predict what it is ! 👻 ",
    },
    {
        title: "Download",
        image: "/icons/file.svg",
        text:
            "If you ever want to reuse the model (because we will delete the model on the server later) then you need to download and save my cute litte model somewhere on some type of storage device.",
    },
];

const Introduction = (props: Props) => {
    const [currentStep, setCurrentStep] = useState(0);

    const onChange = (current) => {
        console.log("onChange:", current);
        setCurrentStep(current);
    };

    return (
        <>
            <Row>
                <Col span={24}>
                    <Typography>
                        <Title
                            style={{
                                fontFamily: "IBM Plex Mono",
                                fontSize: "6em",
                                textAlign: "center",
                                marginTop: "60px",
                                textDecoration: "#eb2f06 solid underline",
                                textUnderlinePosition: "auto",
                                textDecorationThickness: "10%",
                            }}
                        >
                            Tejas.AI
                            <div
                                style={{
                                    marginLeft: "50px",
                                    marginBottom: "-20px",
                                    width: "100px",
                                    height: "100px",
                                    display: "inline-block",
                                    fontWeight: "bolder",
                                }}
                            >
                                <AnimatedFire />
                            </div>
                        </Title>
                        <Divider dashed />
                        <Steps
                            type="navigation"
                            current={currentStep}
                            onChange={onChange}
                            style={{ marginBottom: "40px" }}
                        >
                            <Step status="process" title="Step 1: Model" />
                            <Step status="process" title="Step 2: Dataset" />
                            <Step status="process" title="Step 3: Training" />
                            <Step status="process" title="Step 4: Inference" />
                            <Step status="process" title="Step 5: Download" />
                        </Steps>

                        <Card
                            style={{
                                fontSize: "1.5em",
                            }}
                        >
                            <Row
                                justify="center"
                                style={{ alignItems: "center" }}
                            >
                                <Col span={5}>
                                    <Image
                                        src={stepData[currentStep].image}
                                        width={150}
                                        height={150}
                                    />
                                </Col>
                                <Col span={15}>
                                    <Typography>
                                        <Title>
                                            {stepData[currentStep].title}
                                        </Title>
                                        <Paragraph>
                                            {stepData[currentStep].text}
                                        </Paragraph>
                                    </Typography>
                                </Col>
                            </Row>
                        </Card>
                        <Divider />
                        <Row
                            justify="center"
                            style={{
                                textAlign: "center",
                            }}
                        >
                            <Col span={24}>
                                <Button
                                    type="primary"
                                    icon={<RightCircleOutlined />}
                                >
                                    Start Experimenting !
                                </Button>
                            </Col>
                        </Row>
                    </Typography>
                </Col>
            </Row>
        </>
    );
};

export default Introduction;
