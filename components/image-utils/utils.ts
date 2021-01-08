import FileResizer from "react-image-file-resizer";

const blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName, {
        lastModified: new Date().getTime(),
        type: theBlob.type,
    });
};

const resizeImage224 = (file): Promise<string> =>
    new Promise((resolve) => {
        FileResizer.imageFileResizer(
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

export { resizeImage224, blobToFile };
