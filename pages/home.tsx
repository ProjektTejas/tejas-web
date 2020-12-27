import Layout from "../components/core/layout";
import Sidebar from "../components/core/sidebar";
import { Button, Col, Layout as ALayout, Modal, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";

import { Header as AHeader } from "antd/lib/layout/layout";
import Header from "../components/core/header";
import Footer from "../components/core/footer";
import {
    CustomFileMap,
    VFSBrowser,
} from "../components/file-manager/VFSBrowser";

import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import JSZip from "jszip";

import Resizer from "react-image-file-resizer";
import { resolve } from "path";
import { url } from "inspector";
import { useEffect, useState } from "react";
import {
    FileTypeNotSupported,
    IncorrectFolderStructure,
    MaxFilesReachedError,
    MultipleFolderError,
} from "../components/helpers/uploadModals";
import { useDebounce } from "use-debounce";

const { Dragger } = Upload;

const props = {
    // name: "file",
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
        // console.log(info);
        // const { status } = info.file;
        // if (status !== "uploading") {
        //     console.log(info.file, info.fileList);
        // }
        // if (status === "done") {
        //     message.success(`${info.file.name} file uploaded successfully.`);
        // } else if (status === "error") {
        //     message.error(`${info.file.name} file upload failed.`);
        // }
    },
};

const blankFileMap = {
    rootFolderId: "dataset_root",
    fileMap: {
        dataset_root: {
            id: "dataset_root",
            name: "dataset_root",
            isDir: true,
            childrenIds: [],
            childrenCount: 0,
        },
    },
};

const Home = () => {
    var zip: JSZip = new JSZip();
    var dataUrl: string;
    var totalFiles: number = 0;

    const [fileList, setFileList] = useState([]);
    const [debouncedFileList] = useDebounce(fileList, 1000);
    // var fileList = [];

    // Listen to the changes in fileList and update the Chonky UI accordingly
    useEffect(() => {
        // effect
        console.log(fileList);

        // setFileMap(blankFileMap);

        var newFileMap = JSON.parse(JSON.stringify(blankFileMap));

        debouncedFileList.forEach((file) => {
            const folderName = file.webkitRelativePath.split("/")[1];

            // var newFileMap = JSON.parse(JSON.stringify(fileMap));

            if (newFileMap.fileMap[btoa(folderName)] === undefined) {
                newFileMap.fileMap[btoa(folderName)] = {
                    id: btoa(folderName),
                    name: folderName,
                    isDir: true,
                    modDate: file.lastModifiedDate,
                    childrenIds: [],
                    childrenCount: 0,
                    parentId: fileMap.rootFolderId,
                };

                // add the above folder to the root folder
                newFileMap.fileMap[newFileMap.rootFolderId]["childrenIds"] = [
                    ...newFileMap.fileMap[fileMap.rootFolderId]["childrenIds"],
                    btoa(folderName),
                ];

                newFileMap.fileMap[fileMap.rootFolderId]["childrenCount"] += 1;
            }

            // add the file to the above folder
            newFileMap.fileMap[file.uid] = {
                id: file.uid,
                name: file.name,
                size: file.size,
                modDate: file.lastModifiedDate,
                parentId: btoa(folderName),
            };

            newFileMap.fileMap[btoa(folderName)]["childrenIds"] = [
                ...newFileMap.fileMap[btoa(folderName)]["childrenIds"],
                file.uid,
            ];

            newFileMap.fileMap[btoa(folderName)]["childrenCount"] += 1;

            // setFileMap(newFileMap);
        });
        setFileMap(newFileMap);
    }, [debouncedFileList]);

    const [fileMap, setFileMap] = useState(blankFileMap);
    const [currentFolderId, setCurrentFolderId] = useState(
        fileMap["rootFolderId"]
    );
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({
        title: "",
        message: "",
    });

    const resetFileMap = () => {
        // fileList = [];
        setFileList([]);
        zip = new JSZip();
        totalFiles = 0;
        setFileMap(blankFileMap);
        console.info("Folders Reset Successfully");
    };

    const showModal = (data) => {
        setModalData(data);
        setModalVisible(true);
    };

    const resizeImage224 = (file): Promise<string> =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                224,
                224,
                "JPEG",
                90,
                0,
                async (uri: string) => {
                    resolve(uri);
                },
                "base64",
                224,
                224
            );
        });

    return (
        <>
            <Head>
                {/* <!-- UIkit CSS --> */}
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/uikit@3.6.5/dist/css/uikit.min.css"
                />

                {/* <!-- UIkit JS --> */}
                <script src="https://cdn.jsdelivr.net/npm/uikit@3.6.5/dist/js/uikit.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/uikit@3.6.5/dist/js/uikit-icons.min.js"></script>
            </Head>
            <Layout>
                <Content
                    style={{
                        padding: "24px",
                        minHeight: 280,
                    }}
                >
                    <Row gutter={[8, 8]}>
                        <Col span={24} style={{ height: "60vh" }}>
                            <VFSBrowser
                                currentFolderId={currentFolderId}
                                setCurrentFolderId={setCurrentFolderId}
                                fileMap={
                                    (fileMap.fileMap as unknown) as CustomFileMap
                                }
                                resetFileMap={resetFileMap}
                            />
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]}>
                        <Col span={24} style={{ height: "20vh" }}>
                            <Dragger
                                {...props}
                                customRequest={({
                                    onSuccess,
                                    onError,
                                    file,
                                }) => {
                                    // showModal(MultipleFolderError);
                                    console.log(file);
                                    // console.log(totalFiles);
                                    if (
                                        file.type == "image/jpeg" ||
                                        file.type == "image/png"
                                    ) {
                                        if (
                                            file.webkitRelativePath.split("/")
                                                .length !== 3
                                        ) {
                                            showModal(
                                                IncorrectFolderStructure(
                                                    file.webkitRelativePath
                                                )
                                            );
                                        } else {
                                            // const imageUri: string = await resizeImage224(
                                            //     file
                                            // );

                                            // const imageBlob = await (
                                            //     await fetch(imageUri)
                                            // ).blob();

                                            // zip.file(
                                            //     file.webkitRelativePath,
                                            //     imageBlob
                                            // );

                                            // console.log(imageBlob);
                                            // console.log(totalFiles);
                                            if (totalFiles > 100) {
                                                resetFileMap();
                                                showModal(MaxFilesReachedError);
                                            }

                                            // update the fileList
                                            setFileList((prevState) => [
                                                ...prevState,
                                                file,
                                            ]);

                                            totalFiles++;
                                        }
                                    } else {
                                        // if its not an ini file then show unsupported error
                                        // this is special for windows only
                                        if (!file.name.includes(".ini")) {
                                            showModal(
                                                FileTypeNotSupported(
                                                    `${file.name} ${file.type}`
                                                )
                                            );
                                        }
                                    }
                                }}
                                showUploadList={false}
                                directory
                                multiple
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    Click or drag file to this area to upload a
                                    Folder with Image Classes
                                </p>
                                <p className="ant-upload-hint">
                                    Supports upload for only folders. Strictly
                                    prohibit from uploading company data or
                                    other band files. Reset the Dataset to begin
                                    fresh upload.
                                </p>
                            </Dragger>
                        </Col>
                    </Row>

                    <Row gutter={[8, 8]}>
                        <Button
                            onClick={async () => {
                                // const fileUrl = URL.createObjectURL(
                                //     await zip.generateAsync({ type: "blob" })
                                // );
                                // console.log(fileUrl);
                                // const w = window.open(fileUrl, "_blank");
                                // w && w.focus();
                                console.log(fileMap);
                                console.log(fileList);
                            }}
                        >
                            Generate
                        </Button>
                    </Row>
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
