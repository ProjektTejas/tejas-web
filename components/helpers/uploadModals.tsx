const MultipleFolderError = {
    title: "Multiple Folder Error",
    message:
        "Please upload/select a single folder that contains the class name folders with images 😀",
};

const EmptyDataset = {
    title: "Empty Dataset",
    message:
        "Please upload a Image Folder in the Dataset section to train your model",
};

const MaxFilesReachedError = {
    title: "Maximum Files Reached",
    message:
        "You can upload a maximum of 100 files! you've already exceeded this limit, try again 😕",
};

const FileTypeNotSupported = (fileType) => {
    return {
        title: "File Type Not Supported",
        message: `File Type ${fileType} is not supported as of now ! 🙁`,
    };
};

const IncorrectFolderStructure = (fileName) => {
    return {
        title: "Incorrect Folder Structure",
        message: `File placed in wrong structure ${fileName}, it should be '<root>/<class_name>/<image_file>', try again 😣`,
    };
};

export {
    MultipleFolderError,
    MaxFilesReachedError,
    FileTypeNotSupported,
    IncorrectFolderStructure,
    EmptyDataset,
};
