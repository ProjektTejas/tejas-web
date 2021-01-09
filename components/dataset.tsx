import { InboxOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import Dragger from "antd/lib/upload/Dragger";
import JSZip from "jszip";
import React, { useEffect, useState } from "react";
import FileResizer from "react-image-file-resizer";
import { useDebounce } from "use-debounce";
import { CustomFileMap, VFSBrowser } from "./file-manager/VFSBrowser";
import {
    FileTypeNotSupported,
    IncorrectFolderStructure,
    MaxFilesReachedError,
} from "./helpers/uploadModals";

interface Props {
    showModal: (arg0: { title: string; message: string }) => void;
    fileList: any;
    setFileList;
}

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

const Dataset = (props: Props) => {
    var totalFiles: number = 0;

    const [debouncedFileList] = useDebounce(props.fileList, 1000);

    // Listen to the changes in fileList and update the Chonky UI accordingly
    useEffect(() => {
        // effect
        // console.log(props.fileList);

        var newFileMap = JSON.parse(JSON.stringify(blankFileMap));

        debouncedFileList.forEach((file) => {
            const folderName = file.webkitRelativePath.split("/")[1];

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
                thumbnailUrl: URL.createObjectURL(file),
                parentId: btoa(folderName),
            };

            newFileMap.fileMap[btoa(folderName)]["childrenIds"] = [
                ...newFileMap.fileMap[btoa(folderName)]["childrenIds"],
                file.uid,
            ];

            newFileMap.fileMap[btoa(folderName)]["childrenCount"] += 1;
        });
        setFileMap(newFileMap);
        setShowLoading(false);
    }, [debouncedFileList]);

    const [fileMap, setFileMap] = useState(blankFileMap);
    const [currentFolderId, setCurrentFolderId] = useState(
        fileMap["rootFolderId"]
    );
    const [showLoading, setShowLoading] = useState(false);

    const resetFileMap = () => {
        // fileList = [];
        props.setFileList([]);
        totalFiles = 0;
        setFileMap(blankFileMap);
        console.info("Folders Reset Successfully");
        setShowLoading(false);
    };

    return (
        <>
            <Title
                style={{
                    textAlign: "center",
                    fontFamily: "IBM Plex Mono",
                    fontSize: "4em",
                }}
            >
                Dataset
            </Title>
            <Row gutter={[8, 8]}>
                <Col span={24} style={{ height: "50vh" }}>
                    <VFSBrowser
                        currentFolderId={currentFolderId}
                        setCurrentFolderId={setCurrentFolderId}
                        fileMap={(fileMap.fileMap as unknown) as CustomFileMap}
                        resetFileMap={resetFileMap}
                    />
                </Col>
            </Row>
            {showLoading && (
                <>
                    <Divider />
                    <Row gutter={[8, 8]}>
                        <Col
                            span={24}
                            style={{
                                height: "20vh",
                                fontFamily: "IBM Plex Mono",
                                textAlign: "center",
                            }}
                        >
                            <Spin /> Loading your files
                        </Col>
                    </Row>
                </>
            )}
            {!showLoading && (
                <Row gutter={[8, 8]}>
                    <Col span={24} style={{ height: "20vh" }}>
                        <Dragger
                            {...props}
                            customRequest={({ onSuccess, onError, file }) => {
                                setShowLoading(true);
                                // console.log(file);
                                if (
                                    file.type == "image/jpeg" ||
                                    file.type == "image/png"
                                ) {
                                    if (
                                        file.webkitRelativePath.split("/")
                                            .length !== 3
                                    ) {
                                        props.showModal(
                                            IncorrectFolderStructure(
                                                file.webkitRelativePath
                                            )
                                        );

                                        resetFileMap();
                                    } else {
                                        if (totalFiles > 100) {
                                            resetFileMap();
                                            props.showModal(
                                                MaxFilesReachedError
                                            );
                                        }

                                        // update the fileList
                                        props.setFileList((prevState) => [
                                            ...prevState,
                                            file,
                                        ]);

                                        totalFiles++;
                                    }
                                } else {
                                    // if its not an ini file then show unsupported error
                                    // this is special for windows only
                                    if (!file.name.includes(".ini")) {
                                        props.showModal(
                                            FileTypeNotSupported(
                                                `${file.name} ${file.type}`
                                            )
                                        );

                                        resetFileMap();
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
                                prohibit from uploading company data or other
                                band files. Reset the Dataset to begin fresh
                                upload.
                            </p>
                        </Dragger>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default Dataset;
