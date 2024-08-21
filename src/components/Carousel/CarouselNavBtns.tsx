import { MouseEvent } from "react";
import styles from "./CarouselNavBtns.module.css";

interface CarouselNavBtnsPropsType {
    slideNo: number;
    totalSlides: number;
    setNextSlide: () => void;
    setPrevSlide: () => void;
}

function CarouselNavBtns({
    slideNo,
    totalSlides,
    setPrevSlide,
    setNextSlide,
}: CarouselNavBtnsPropsType) {
	function goToNextSlide (ev: MouseEvent) {
		ev.stopPropagation();
		setNextSlide();
	}

	function goToPrevSlide (ev: MouseEvent) {
		ev.stopPropagation();
		setPrevSlide();
	}

    return (
        <div role="group" className={styles.navBtnsContainer}>
            <button
                className={styles.prevBtn}
                type="button"
                aria-label="Previous slide"
                onClick={goToPrevSlide}
                disabled={slideNo === 0}
            >
                &#10092;
            </button>
            <button
                className={styles.nextBtn}
                type="button"
                aria-label="Next slide"
                onClick={goToNextSlide}
                disabled={slideNo === totalSlides - 1}
            >
                &#10093;
            </button>
        </div>
    );
}

export default CarouselNavBtns;
