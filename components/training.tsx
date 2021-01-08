import Title from "antd/lib/typography/Title";

interface Props {
    showModal: any;
}

const Training = (props: Props) => {
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
        </div>
    );
};

export default Training;
