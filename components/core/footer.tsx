import { Footer as AFooter } from "antd/lib/layout/layout";

const Footer: React.FC = () => {
    return (
        <AFooter
            style={{
                textAlign: "center",
                fontFamily: "IBM Plex Mono",
                // marginLeft: 200,
            }}
        >
            ProjektTejas (2020) Created with <span role="img"> 💖</span> and{" "}
            <span role="img">☕</span>
        </AFooter>
    );
};

export default Footer;
