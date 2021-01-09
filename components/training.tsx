import { ClockCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Button, Descriptions, Divider, Row, Space, Timeline } from "antd";
import Title from "antd/lib/typography/Title";
import JSZip from "jszip";
import { useEffect, useRef, useState } from "react";
import {
    MultipleFolderError,
    EmptyDataset,
    DatasetSameWarning,
} from "./helpers/uploadModals";
import { blobToFile, resizeImage224 } from "./image-utils/utils";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

interface Props {
    showModal: any;
    fileList: Array<TejasFile>;
}

interface TejasFile extends File {
    webkitRelativePath: string;
}

const usePrevious = (value) => {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
};

const Training = (props: Props) => {
    const [timelineTexts, setTimelineTexts] = useState([]);
    const [loading, setLoading] = useState(false);
    const prevFileList = usePrevious(props.fileList);
    const [trainable, setTrainable] = useState(false);

    const addTimelineText = (text) => {
        setTimelineTexts((oldArray) => [...oldArray, text]);
    };

    useEffect(() => {
        // effect
        if (prevFileList !== props.fileList) {
            setTrainable(true);
        }

        console.log(`Trainable: ${trainable}`);

        return () => {
            // cleanup
        };
    }, [props.fileList]);

    return (
        <div>
            <Title
                style={{
                    textAlign: "center",
                    fontFamily: "IBM Plex Mono",
                    fontSize: "4em",
                }}
            >
                Training
            </Title>
            <Divider dashed />
            <Descriptions bordered>
                <Descriptions.Item label="Model Chosen">
                    MobileNetV2
                </Descriptions.Item>
                <Descriptions.Item label="Dataset Size">
                    {props.fileList.length} Images
                </Descriptions.Item>
                <Descriptions.Item label="Estimated Training Time">
                    10 Minutes
                </Descriptions.Item>
            </Descriptions>
            <Divider />
            <div style={{ textAlign: "center" }}>
                <Button
                    type="primary"
                    icon={<RightCircleOutlined />}
                    loading={loading}
                    onClick={async () => {
                        setLoading(true);
                        setTimelineTexts([]);

                        if (!trainable) {
                            setLoading(false);
                            return props.showModal(DatasetSameWarning);
                        }

                        if (props.fileList.length == 0) {
                            setLoading(false);
                            return props.showModal(EmptyDataset);
                        }

                        setTimelineTexts((oldArray) => [
                            ...oldArray,
                            "Creating Dataset Zip File",
                        ]);

                        var zip = new JSZip();

                        for (const file of props.fileList) {
                            // console.log(file);

                            const imageUri: string = await resizeImage224(file);

                            const imageBlob = await (
                                await fetch(imageUri)
                            ).blob();

                            const [
                                _,
                                className_,
                                fileName_,
                            ] = file.webkitRelativePath.split("/");

                            // console.log(`${className_}/${fileName_}`);

                            zip.file(`${className_}/${fileName_}`, imageBlob);
                        }

                        const fileBlob: Blob = await zip.generateAsync({
                            type: "blob",
                        });

                        const datasetFile: File = blobToFile(
                            fileBlob,
                            `${uuidv4()}.zip`
                        );

                        console.log(datasetFile);

                        // const fileUrl = URL.createObjectURL(
                        //     new Blob([datasetFile], { type: "application/zip" })
                        // );

                        // This is for debugging the zip file by downloading it
                        // const fileUrl = URL.createObjectURL(
                        //     await props.zipDataset.generateAsync({
                        //         type: "blob",
                        //     })
                        // );
                        // console.log(fileUrl);
                        // const w = window.open(fileUrl, "_blank");
                        // w && w.focus();

                        setTimelineTexts((oldArray) => [
                            ...oldArray,
                            "Finished Creating Dataset Zip File",
                        ]);

                        let formData = new FormData();
                        formData.append("file", datasetFile);
                        formData.append("model_name", "mobilenet_v2");

                        try {
                            const results = await axios.post(
                                "https://u7stad9b0b.execute-api.ap-south-1.amazonaws.com/dev/api/v1/train/train_model",
                                formData
                            );

                            console.log(results);

                            setTimelineTexts((oldArray) => [
                                ...oldArray,
                                `Task Created with taskId: ${results.data["taskId"]}`,
                            ]);
                        } catch (e) {
                            console.log(e);

                            setTimelineTexts((oldArray) => [
                                ...oldArray,
                                "SOME ERROR OCCURED",
                            ]);
                            setLoading(false);
                            return;
                        }

                        setTimelineTexts((oldArray) => [
                            ...oldArray,
                            "Invoked Training for the Dataset",
                        ]);

                        // everything went success so we have to set trainable to false
                        // setTrainable(false);
                        setLoading(false);
                    }}
                >
                    Start Training !
                </Button>
            </div>
            <Divider> Timeline</Divider>
            <div
                style={{
                    textAlign: "center",
                    marginLeft: "70px",
                    marginRight: "70px",
                }}
            >
                <Timeline mode="alternate">
                    {timelineTexts.map((val, idx) => {
                        return <Timeline.Item key={idx}>{val}</Timeline.Item>;
                    })}
                </Timeline>
            </div>
        </div>
    );
};

export default Training;
