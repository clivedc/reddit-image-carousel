import { Children, PointerEvent, ReactElement } from "react";
import styles from "./CarouselSlides.module.css";

interface CarouselSlidesProps {
    totalSlides: number;
    setNextSlide: () => void;
    setPrevSlide: () => void;
    children: ReactElement[];
}

function CarouselSlides({
    totalSlides,
    setPrevSlide,
    setNextSlide,
    children,
}: CarouselSlidesProps) {
    let dragStart = 0;
    let dragEnd = 0;
    let trackOffsetLeft = 0;

    function handlePointerDown(ev: PointerEvent) {
        if (ev.pointerType !== "touch") return;

        const track = ev.currentTarget;
        trackOffsetLeft = track.getBoundingClientRect().left;
        dragStart = ev.clientX - trackOffsetLeft;
    }

    function handlePointerUp(ev: PointerEvent) {
        if (ev.pointerType !== "touch") return;

        dragEnd = ev.clientX - trackOffsetLeft;
        const dragDiff = dragStart - dragEnd;

        if (Math.abs(dragDiff) < 100) return;

        if (dragDiff < 0) setPrevSlide();
        else setNextSlide();
    }

    return (
        <div
            className={styles.carouselTrack}
            role="group"
            aria-live="polite"
            aria-atomic="true"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
        >
            {Children.map(children, (child, index) => (
                <div
                    className={styles["carouselTrack__slide"]}
                    id={`carouselSlide-${index + 1}`}
                    role="tabpanel"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${totalSlides}`}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}

export default CarouselSlides;
