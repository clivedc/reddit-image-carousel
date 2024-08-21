import Carousel from "./components/Carousel";
import Image from "./components/Image";
import styles from "./App.module.css";

export default function App() {
    const slides = [
        { id: 237, desc: "black puppy", width: "1600", height: "1000" },
        {
            id: 238,
            desc: "Black and white cityscape",
            width: "1280",
            height: "1920",
        },
        {
            id: 239,
            desc: "Dandelion being held",
            width: "1200",
            height: "1200",
        },
    ].map((obj, index) => (
        <Image
            key={obj.id}
            src={`https://picsum.photos/id/${obj.id}/${obj.width}/${obj.height}`}
            alt={obj.desc}
            fetchPriority={index === 0 ? "auto" : "low"}
        />
    ));

    return (
        <div className={styles.mediaContainer}>
            <Carousel ariaLabel="demo">
                {slides}
            </Carousel>
        </div>
    );
}
