import { ComponentPropsWithoutRef } from "react";
import styles from "./index.module.css";

interface ImagePropsType extends ComponentPropsWithoutRef<"img"> {
    src: string;
    alt: string;
}

function Image(props: ImagePropsType) {
    return (
        <div className={styles.imgWrapper}>
            <img
                {...props}
                className={styles.imgBg}
                alt=""
                role="presentation"
            />
            <img {...props} className={styles.img} />
        </div>
    );
}

export default Image;
