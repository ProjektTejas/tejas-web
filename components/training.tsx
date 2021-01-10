import {
    ClockCircleOutlined,
    ExperimentOutlined,
    RightCircleOutlined,
} from "@ant-design/icons";
import {
    Button,
    Descriptions,
    Divider,
    Progress,
    Row,
    Space,
    Timeline,
    Typography,
} from "antd";
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
import { HTTPErrorMessage } from "./helpers/customErrors";
import { TEJAS_API_V1 } from "../lib/tejasEndpoints";

const { Paragraph } = Typography;

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.get["Access-Control-Allow-Origin"] = "*";

interface Props {
    showModal: any;
    fileList: Array<TejasFile>;
    setMainTaskId;
    setCurrentStep;
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

const taskProgressPercentageMap = {
    UNKNOWN: 0,
    FAILED: -10,
    INITIALIZING: 10,
    TRAINING: 40,
    COMPLETED: 100,
};

// probe cooldown in seconds
const PROBE_COOLDOWN = 60;

// maximum times to probe
const PROBE_MAX_TIMES = 10;

// so in total we probe for 60*10 == 600 seconds == 10 minutes

const Training = (props: Props) => {
    const [timelineTexts, setTimelineTexts] = useState([]);
    const [loading, setLoading] = useState(false);
    const prevFileList = usePrevious(props.fileList);
    const [trainable, setTrainable] = useState(false);
    // const [finishedTaskId, setFinishedTaskId] = useState(undefined);
    const [taskStatus, setTaskStatus] = useState("");
    const [taskStatusPercentage, setTaskStatusPercentage] = useState(0);
    const [currentTaskId, setCurrentTaskId] = useState("");

    const addTimelineText = (text) => {
        setTimelineTexts((oldArray) => [...oldArray, text]);
    };

    useEffect(() => {
        // effect
        props.setMainTaskId(currentTaskId);
        return () => {
            // cleanup
        };
    }, [currentTaskId]);

    useEffect(() => {
        // effect
        if (prevFileList !== props.fileList) {
            setTrainable(true);
        }

        // console.log(`Trainable: ${trainable}`);

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

                        if (!trainable) {
                            setLoading(false);
                            return props.showModal(DatasetSameWarning);
                        }

                        if (props.fileList.length == 0) {
                            setLoading(false);
                            return props.showModal(EmptyDataset);
                        }

                        // reset the timeline
                        setTimelineTexts([]);

                        addTimelineText("Creating Dataset Zip File");

                        // create the resized zip file
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

                        addTimelineText("Finished Creating Dataset Zip File");

                        let formData = new FormData();
                        formData.append("file", datasetFile);
                        formData.append("model_name", "mobilenet_v2");

                        try {
                            // upload the zip file and start training
                            const results = await axios.post(
                                `${TEJAS_API_V1}/train/train_model`,
                                formData
                            );

                            console.log(results);

                            const taskId: string = results.data["taskId"];

                            // this id is for testing
                            // const taskId =
                            //     "ff9d8adf-14cd-4a05-87d8-e49d4d0ed7c5";

                            setCurrentTaskId(taskId);

                            addTimelineText(
                                `Task Created with taskId: ${taskId}`
                            );

                            // Now that the training task is created
                            // Start probing the STATUS of the Model Training
                            let timesProbed = 0;
                            let lastStatus = "";

                            let intervalProbe = setInterval(async () => {
                                // check if maxprobe is reached
                                if (timesProbed == PROBE_MAX_TIMES) {
                                    clearInterval(intervalProbe);
                                }

                                // probe the status
                                try {
                                    const results = await axios.get(
                                        `${TEJAS_API_V1}/tasks/details`,
                                        {
                                            params: {
                                                task_id: taskId,
                                            },
                                        }
                                    );

                                    console.log(results);

                                    const taskStatusData = results.data;

                                    if (
                                        taskStatusData["taskStatus"] !=
                                        lastStatus
                                    ) {
                                        addTimelineText(
                                            `Task Status: ${taskStatusData["taskStatus"]}`
                                        );
                                    }

                                    // set the task status
                                    setTaskStatus(taskStatusData["taskStatus"]);
                                    // update the percentage
                                    setTaskStatusPercentage(
                                        taskProgressPercentageMap[
                                            taskStatusData["taskStatus"]
                                        ]
                                    );

                                    // training is complete, stop probing
                                    if (
                                        taskStatusData["taskStatus"] ==
                                        "COMPLETED"
                                    ) {
                                        clearInterval(intervalProbe);
                                        // everything went success so we have to set trainable to false
                                        setTrainable(false);
                                        setLoading(false);
                                    }

                                    lastStatus = taskStatusData["taskStatus"];
                                } catch (e) {
                                    // some error occured in probing, stop everything
                                    clearInterval(intervalProbe);
                                    throw e;
                                }

                                timesProbed++;
                            }, PROBE_COOLDOWN * 1000); // probe every PROBE_COOLDOWN seconds, maximum PROBE_MAX_TIMES
                        } catch (e) {
                            // Some Error Occured
                            console.log(e);

                            if (e.response !== undefined) {
                                addTimelineText(
                                    `ERROR: ${JSON.stringify(e.response)}`
                                );
                                props.showModal(
                                    HTTPErrorMessage(JSON.stringify(e.response))
                                );
                            } else {
                                addTimelineText(`ERROR: ${JSON.stringify(e)}`);
                                props.showModal(
                                    HTTPErrorMessage(JSON.stringify(e))
                                );
                            }

                            // some error occured, we have to allow trainable
                            setTrainable(true);
                            setLoading(false);
                        }
                    }}
                >
                    Start Training !
                </Button>
            </div>
            <Divider>Timeline</Divider>
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
            {currentTaskId !== "" && (
                <>
                    <Divider>Status</Divider>
                    <div
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <Descriptions
                            bordered
                            size={"small"}
                            column={{
                                xxl: 1,
                                xl: 1,
                                lg: 1,
                                md: 1,
                                sm: 1,
                                xs: 1,
                            }}
                        >
                            <Descriptions.Item label="TaskID">
                                <Paragraph copyable>{currentTaskId}</Paragraph>
                            </Descriptions.Item>
                            <Descriptions.Item label="Progress">
                                <Progress
                                    percent={taskStatusPercentage}
                                    status={
                                        taskStatus == "FAILED"
                                            ? "exception"
                                            : taskStatus == "COMPLETED"
                                            ? "success"
                                            : "active"
                                    }
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                {taskStatus}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                    {taskStatus == "COMPLETED" && (
                        <div
                            style={{
                                textAlign: "center",
                                marginTop: "20px",
                            }}
                        >
                            <Button
                                type="primary"
                                icon={<ExperimentOutlined />}
                                onClick={() => {
                                    props.setCurrentStep("inference");
                                }}
                            >
                                Start Inferencing
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Training;
