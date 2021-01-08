import Layout from "../components/core/layout";
import { Modal } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";
import { useState } from "react";
import Sidebar from "../components/core/sidebar";
import Introduction from "../components/introduction";
import Model from "../components/model";
import Dataset from "../components/dataset";
import Training from "../components/training";
import Inference from "../components/inference";
import Download from "../components/download";

const Home = () => {
    const [currentStep, setCurrentStep] = useState("introduction");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({
        title: "",
        message: "",
    });

    const showModal = (data) => {
        setModalData(data);
        setModalVisible(true);
    };
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
                        <Introduction showModal={showModal} />{" "}
                    </div>

                    <div className={currentStep !== "model" ? "hidden" : ""}>
                        <Model showModal={showModal} />
                    </div>

                    <div className={currentStep !== "dataset" ? "hidden" : ""}>
                        <Dataset showModal={showModal} />
                    </div>

                    <div className={currentStep !== "training" ? "hidden" : ""}>
                        <Training showModal={showModal} />
                    </div>

                    <div
                        className={currentStep !== "inference" ? "hidden" : ""}
                    >
                        <Inference showModal={showModal} />
                    </div>

                    <div className={currentStep !== "download" ? "hidden" : ""}>
                        <Download showModal={showModal} />
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
