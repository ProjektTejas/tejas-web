import { Divider } from "antd";
import Title from "antd/lib/typography/Title";

interface Props {
    showModal: any;
}

const Inference = (props: Props) => {
    return (
        <div>
            <Title
                style={{
                    textAlign: "center",
                    fontFamily: "IBM Plex Mono",
                    fontSize: "4em",
                }}
            >
                Inference
            </Title>

            <Divider dashed />
        </div>
    );
};

export default Inference;
