import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
            <a
                href="https://github.com/ProjektTejas"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    color: "#2980b9",
                    fontWeight: "bold",
                }}
            >
                <FontAwesomeIcon icon={faGithub} /> ProjektTejas (2020)
            </a>{" "}
            Created with <span role="img"> 💖</span> and{" "}
            <span role="img">☕</span>
        </AFooter>
    );
};

export default Footer;
