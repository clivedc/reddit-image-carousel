import React, {
    Children,
    MouseEvent,
    ReactElement,
    useEffect,
    useRef,
    useState,
} from "react";
import CarouselSlides from "./CarouselSlides";
import CarouselDots, { dotIndicatorRefType } from "./CarouselDots";
import CarouselNavBtns from "./CarouselNavBtns";
import ExpandedStateCloseBtn from "./ExpandedStateCloseBtn";
import styles from "./index.module.css";

interface CarouselPropsType {
    width?: string;
    ariaLabel: string;
    children: ReactElement[];
}

function Carousel({ width, ariaLabel, children }: CarouselPropsType) {
    // 0 based, 0 -> 1st slide
    const [slideNo, setSlideNo] = useState(0);
    const dotIndicatorRef = useRef<null | dotIndicatorRefType>(null);
    const totalSlides = Children.count(children);
    const carouselContainerRef = useRef<HTMLDivElement | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const DOMRectBeforeExpanding = useRef<undefined | DOMRect>();

    useEffect(() => {
        const DOMRectBefore = DOMRectBeforeExpanding.current;
        const carouselContainer = carouselContainerRef.current;
        if (!DOMRectBefore || !carouselContainer) return;

        const DOMRectAfter = carouselContainer.getBoundingClientRect();
        const diff = {
            left: DOMRectBefore.left - DOMRectAfter.left,
            top: DOMRectBefore.top - DOMRectAfter.top,
            width: DOMRectBefore.width / DOMRectAfter.width,
            height: DOMRectBefore.height / DOMRectAfter.height,
        };

        const animation = carouselContainer.animate(
            {
                transform: [
                    `translate(${diff.left}px, ${diff.top}px) scale(${diff.width}, ${diff.height})`,
                    "translate(0) scale(1)",
                ],
            },
            { duration: 100, easing: "ease-out" },
        );

        animation.onfinish = () => {
            animation.cancel();
        };
    }, [isExpanded]);

    function setNextSlide() {
        if (slideNo === totalSlides - 1) return;
        if (!dotIndicatorRef.current) return;

        dotIndicatorRef.current.setPreviousIndicatorStyles();
        setSlideNo((prevSlideNo) => prevSlideNo + 1);
    }

    function setPrevSlide() {
        if (slideNo === 0) return;
        if (!dotIndicatorRef.current) return;

        dotIndicatorRef.current.setPreviousIndicatorStyles();
        setSlideNo((prevSlideNo) => prevSlideNo - 1);
    }

    function setCurrentSlide(newSlideNo: number) {
        if (!dotIndicatorRef.current) return;

        dotIndicatorRef.current.setPreviousIndicatorStyles();
        setSlideNo(newSlideNo);
    }

    function enterExpandedState() {
        const carouselContainer = carouselContainerRef.current;
        if (!carouselContainer) return;

        DOMRectBeforeExpanding.current =
            carouselContainer.getBoundingClientRect();
        setIsExpanded(true);
    }

    function exitExpandedState(ev: MouseEvent) {
        ev.stopPropagation();
        setIsExpanded(false);
    }

    return (
        <section
            style={
                {
                    "--slide-no": slideNo,
                    "--carousel-width": width,
                } as React.CSSProperties
            }
            className={styles.carouselContainer}
            ref={carouselContainerRef}
            aria-roledescription="carousel"
            aria-label={ariaLabel}
            data-expanded={isExpanded}
            onClick={enterExpandedState}
        >
            {isExpanded && (
                <ExpandedStateCloseBtn
                    isExpanded={isExpanded}
                    exitExpandedState={exitExpandedState}
                />
            )}
            {totalSlides !== 1 && (
                <CarouselDots
                    slideNo={slideNo}
                    totalSlides={totalSlides}
                    setCurrentSlide={setCurrentSlide}
                    setNextSlide={setNextSlide}
                    setPrevSlide={setPrevSlide}
                    ref={dotIndicatorRef}
                />
            )}
            {totalSlides !== 1 && (
                <CarouselNavBtns
                    slideNo={slideNo}
                    totalSlides={totalSlides}
                    setNextSlide={setNextSlide}
                    setPrevSlide={setPrevSlide}
                />
            )}
            <CarouselSlides
                totalSlides={totalSlides}
                setNextSlide={setNextSlide}
                setPrevSlide={setPrevSlide}
            >
                {children}
            </CarouselSlides>
        </section>
    );
}

export default Carousel;
