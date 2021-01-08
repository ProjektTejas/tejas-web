import { ClockCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Button, Descriptions, Divider, Row, Space, Timeline } from "antd";
import Title from "antd/lib/typography/Title";
import JSZip from "jszip";
import { useState } from "react";
import { MultipleFolderError, EmptyDataset } from "./helpers/uploadModals";
import { blobToFile, resizeImage224 } from "./image-utils/utils";
import { v4 as uuidv4 } from "uuid";

interface Props {
    showModal: any;
    fileList: Array<TejasFile>;
}

interface TejasFile extends File {
    webkitRelativePath: string;
}

const Training = (props: Props) => {
    const [timelineTexts, setTimelineTexts] = useState([]);
    const [loading, setLoading] = useState(false);

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
