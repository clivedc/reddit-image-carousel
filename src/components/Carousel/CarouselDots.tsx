import {
    forwardRef,
    KeyboardEvent,
    MouseEvent,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";
import styles from "./CarouselDots.module.css";
import expandAndShrinkActiveDotIndicator from "./expandAndShrinkActiveDotIndicator";

interface CarouselDotsType {
    slideNo: number;
    totalSlides: number;
    setCurrentSlide: (newSlideNo: number) => void;
    setNextSlide: () => void;
    setPrevSlide: () => void;
}

export type dotIndicatorRefType = {
    setPreviousIndicatorStyles: () => void;
};

const CarouselDots = forwardRef(function CarouselDots(
    {
        slideNo,
        totalSlides,
        setCurrentSlide,
        setNextSlide,
        setPrevSlide,
    }: CarouselDotsType,
    dotIndicatorRef,
) {
    const dotsContainerRef = useRef<null | HTMLDivElement>(null);
    const activeDotRef = useRef<null | HTMLButtonElement>(null);
    const activeDotIndicatorRef = useRef<null | HTMLDivElement>(null);
    const prevSlideNo = useRef(slideNo);
    const prevDotIndicatorStyles = useRef<DOMRect>({} as DOMRect);

    // This will be used by container in index.tsx
    useImperativeHandle(dotIndicatorRef, () => {
        return {
            setPreviousIndicatorStyles() {
                const activeDotIndicator = activeDotIndicatorRef.current;
                if (!activeDotIndicator) return;

                prevDotIndicatorStyles.current =
                    activeDotIndicator.getBoundingClientRect();
            },
        };
    });

    // Expand and shrink the indicator when changing slides
    useEffect(() => {
        // don't do anything on first mounted
        if (prevSlideNo.current === slideNo) return;

		async function playAnimationAndUpdatePrevSlideNo () {
			await expandAndShrinkActiveDotIndicator(activeDotIndicatorRef, prevSlideNo, slideNo, prevDotIndicatorStyles);
			prevSlideNo.current = slideNo;
		}

		playAnimationAndUpdatePrevSlideNo();
    }, [slideNo]);

    // Needed for focusing activeDot when using keyboard navigation
    useEffect(() => {
        const activeDot = activeDotRef.current;
        const dotsContainer = dotsContainerRef.current;

        if (!activeDot || !dotsContainer) return;

        const focusedElement = document.activeElement;

        if (
            dotsContainer.contains(focusedElement) &&
            focusedElement !== activeDot
        ) {
            activeDot.focus();
        }
    }, [slideNo]);

    function handleClick(ev: MouseEvent) {
        const input = ev.currentTarget as HTMLButtonElement;
        ev.stopPropagation();
        setCurrentSlide(Number(input.dataset.index));
    }

    function handleKeyDown(ev: KeyboardEvent) {
        const key = ev.key.toLowerCase();

        switch (key) {
            case "arrowright":
                setNextSlide();
                // focusing is handled in useEffect since state isn't
                // set immediately
                break;
            case "arrowleft":
                setPrevSlide();
                // focusing is handled in useEffect
                break;
            case "home":
                setCurrentSlide(0);
                // focusing is handled in useEffect
                break;
            case "end":
                setCurrentSlide(totalSlides - 1);
                // focusing is handled in useEffect
                break;
            default:
                break;
        }
    }

    return (
        <div
            className={styles.carouselDotsContainer}
            role="tablist"
            aria-label="Slides"
            ref={dotsContainerRef}
            onKeyDown={handleKeyDown}
        >
            {range(1, totalSlides).map((value, index) => (
                <button
                    className={styles.carouselDot}
                    type="button"
                    key={value}
                    role="tab"
                    aria-label={`Slide ${value}`}
                    aria-controls={`carouselSlide-${value}`} // id of slide, carouselSlide-1 -> id of 1st slide
                    data-index={index}
                    tabIndex={slideNo === index ? undefined : -1} // undefined since default tabindex for a button is 0 ie. focusable
                    aria-selected={slideNo === index}
                    ref={slideNo === index ? activeDotRef : null}
                    onClick={handleClick}
                ></button>
            ))}
            <div
                className={styles.activeDotIndicator}
                ref={activeDotIndicatorRef}
            ></div>
        </div>
    );
});

function range(start: number, end: number) {
    const result: number[] = [];

    for (let i = start; i <= end; i++) {
        result.push(i);
    }

    return result;
}

export default CarouselDots;
