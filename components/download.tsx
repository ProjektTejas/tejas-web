import Title from "antd/lib/typography/Title";

interface Props {
    showModal: any;
}

const Download = (props: Props) => {
    return (
        <div>
            <Title
                style={{
                    textAlign: "center",
                    fontFamily: "IBM Plex Mono",
                    fontSize: "4em",
                }}
            >
                Download
            </Title>
        </div>
    );
};

export default Download;
