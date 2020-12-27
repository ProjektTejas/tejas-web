/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import {
    ChonkyActions,
    ChonkyFileActionData,
    ChonkyIconName,
    defineFileAction,
    FileArray,
    FileBrowserProps,
    FileData,
    FileHelper,
    FullFileBrowser,
} from "chonky";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { showActionNotification } from "./util";

// We define a custom interface for file data because we want to add some custom fields
// to Chonky's built-in `FileData` interface.
interface CustomFileData extends FileData {
    parentId?: string;
    childrenIds?: string[];
}
export interface CustomFileMap {
    [fileId: string]: CustomFileData;
}

export const useFiles = (
    fileMap: CustomFileMap,
    currentFolderId: string
): FileArray => {
    return useMemo(() => {
        const currentFolder = fileMap[currentFolderId];
        const childrenIds = currentFolder.childrenIds!;
        const files = childrenIds.map((fileId: string) => fileMap[fileId]);
        return files;
    }, [currentFolderId, fileMap]);
};

export const useFolderChain = (
    fileMap: CustomFileMap,
    currentFolderId: string
): FileArray => {
    return useMemo(() => {
        const currentFolder = fileMap[currentFolderId];

        const folderChain = [currentFolder];

        let parentId = currentFolder.parentId;
        while (parentId) {
            const parentFile = fileMap[parentId];
            if (parentFile) {
                folderChain.unshift(parentFile);
                parentId = parentFile.parentId;
            } else {
                break;
            }
        }

        return folderChain;
    }, [currentFolderId, fileMap]);
};

export const useFileActionHandler = (
    setCurrentFolderId: (folderId: string) => void,
    resetFolders: () => void
) => {
    return useCallback(
        (data: ChonkyFileActionData) => {
            if (data.id === ChonkyActions.OpenFiles.id) {
                const { targetFile, files } = data.payload;
                const fileToOpen = targetFile ?? files[0];
                if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
                    setCurrentFolderId(fileToOpen.id);
                    return;
                }
            } else if (data.id === ChonkyActions.DeleteFiles.id) {
            } else if (data.id === ChonkyActions.MoveFiles.id) {
            } else if (data.id === ChonkyActions.CreateFolder.id) {
            } else if (data.id == resetFoldersAction.id) {
                resetFolders();
            }

            showActionNotification(data);
        },
        [setCurrentFolderId]
    );
};

const resetFoldersAction = defineFileAction({
    id: "reset_folders",
    requiresSelection: false,
    button: {
        name: "Reset Dataset",
        toolbar: true,
        contextMenu: true,
        icon: ChonkyIconName.trash,
    },
});

export interface VFSProps {
    fileMap: any;
    currentFolderId: string;
    setCurrentFolderId: any;
    resetFileMap: any;
}

export const VFSBrowser: React.FC<VFSProps> = React.memo(
    ({ fileMap, currentFolderId, setCurrentFolderId, resetFileMap }) => {
        const files = useFiles(fileMap, currentFolderId);
        const folderChain = useFolderChain(fileMap, currentFolderId);
        const handleFileAction = useFileActionHandler(
            setCurrentFolderId,
            resetFileMap
        );
        const fileActions = useMemo(() => [resetFoldersAction], []);
        const thumbnailGenerator = useCallback(
            (file: FileData) => (file.thumbnailUrl ? file.thumbnailUrl : null),
            []
        );

        return (
            <FullFileBrowser
                files={files}
                folderChain={folderChain}
                fileActions={fileActions}
                onFileAction={handleFileAction}
                thumbnailGenerator={thumbnailGenerator}
            />
        );
    }
);
