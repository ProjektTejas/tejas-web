import styles from "./fire.module.css";

const AnimatedFire = () => {
    return (
        <div style={{ position: "relative", width: 100, height: 100 }}>
            <div className="fire">
                <div className={styles["fire-left"]}>
                    <div className={styles["main-fire"]}></div>
                    <div className={styles["particle-fire"]}></div>
                </div>
                <div className={styles["fire-main"]}>
                    <div className={styles["main-fire"]}></div>
                    <div className={styles["particle-fire"]}></div>
                </div>
                <div className={styles["fire-right"]}>
                    <div className={styles["main-fire"]}></div>
                    <div className={styles["particle-fire"]}></div>
                </div>
                <div className={styles["fire-bottom"]}>
                    <div className={styles["main-fire"]}></div>
                </div>
            </div>
        </div>
    );
};

export default AnimatedFire;
