import { Divider } from "antd";
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
            <Divider dashed />
        </div>
    );
};

export default Download;
