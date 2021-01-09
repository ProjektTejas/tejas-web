import Layout from "../components/core/layout";
import { Modal } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";
import { useEffect, useState } from "react";
import Sidebar from "../components/core/sidebar";
import Introduction from "../components/introduction";
import Model from "../components/model";
import Dataset from "../components/dataset";
import Training from "../components/training";
import Inference from "../components/inference";
import Download from "../components/download";
import JSZip from "jszip";
import axios from "axios";
import { TEJAS_API_V1 } from "../lib/tejasEndpoints";

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.get["Access-Control-Allow-Origin"] = "*";

const Home = () => {
    const [currentStep, setCurrentStep] = useState("introduction");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({
        title: "",
        message: "",
    });
    const [mainTaskId, setMainTaskid] = useState("");

    const showModal = (data) => {
        setModalData(data);
        setModalVisible(true);
    };

    // DATASET STATE
    const [fileList, setFileList] = useState([]);

    const wakeUpLambda = async () => {
        try {
            const results = await axios.get(
                `${TEJAS_API_V1}/utils/test_server`
            );
            console.log(results);
            console.log(results.data);
        } catch (e) {
            console.log(e);
        }
    };

    // This is just to wake up lambda
    useEffect(() => {
        // effect

        wakeUpLambda();

        return () => {
            // cleanup
        };
    }, []);

    return (
        <>
            <Layout
                sidebar={
                    <Sidebar
                        width={200}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                    />
                }
            >
                <Content
                    style={{
                        margin: "24px",
                        padding: "24px",
                        minHeight: 280,
                        background: "#fff",
                    }}
                >
                    <div
                        className={
                            currentStep !== "introduction" ? "hidden" : ""
                        }
                    >
                        <Introduction
                            setCurrentStep={setCurrentStep}
                            showModal={showModal}
                        />{" "}
                    </div>

                    <div className={currentStep !== "model" ? "hidden" : ""}>
                        <Model
                            setCurrentStep={setCurrentStep}
                            showModal={showModal}
                        />
                    </div>

                    <div className={currentStep !== "dataset" ? "hidden" : ""}>
                        <Dataset
                            fileList={fileList}
                            setFileList={setFileList}
                            showModal={showModal}
                        />
                    </div>

                    <div className={currentStep !== "training" ? "hidden" : ""}>
                        <Training
                            fileList={fileList}
                            setMainTaskId={setMainTaskid}
                            showModal={showModal}
                            setCurrentStep={setCurrentStep}
                        />
                    </div>

                    <div
                        className={currentStep !== "inference" ? "hidden" : ""}
                    >
                        <Inference
                            mainTaskid={mainTaskId}
                            showModal={showModal}
                        />
                    </div>

                    <div className={currentStep !== "download" ? "hidden" : ""}>
                        <Download
                            mainTaskId={mainTaskId}
                            showModal={showModal}
                        />
                    </div>
                    <Modal
                        title={modalData.title}
                        centered
                        visible={modalVisible}
                        onOk={() => setModalVisible(false)}
                        onCancel={() => setModalVisible(false)}
                        style={{
                            fontFamily: "IBM Plex Mono",
                        }}
                    >
                        <p>{modalData.message}</p>
                    </Modal>
                </Content>
            </Layout>
        </>
    );
};

export default Home;
