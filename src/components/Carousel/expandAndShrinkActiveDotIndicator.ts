import { MutableRefObject } from "react";

const activeDotIndicatorShrinkAnimationOptions: KeyframeAnimationOptions = {
    duration: 150,
    easing: "ease-out",
    fill: "forwards",
};

const activeDotIndicatorExpandAnimationOptions: KeyframeAnimationOptions = {
	...activeDotIndicatorShrinkAnimationOptions,
	delay: 300,
}

export default async function expandAndShrinkActiveDotIndicator(
    activeDotIndicatorRef: MutableRefObject<HTMLDivElement | null>,
    prevSlideNo: MutableRefObject<number>,
    slideNo: number,
    prevDotIndicatorStyles: MutableRefObject<DOMRect>,
) {
    const activeDotIndicator = activeDotIndicatorRef.current;
    if (!activeDotIndicator) return;

    let isGoingRight = true;
    if (prevSlideNo.current > slideNo) isGoingRight = false;

    const prevIndicatorStyles = prevDotIndicatorStyles.current;
    const afterIndicatorStyles = activeDotIndicator.getBoundingClientRect();
    const indicatorWidth = prevIndicatorStyles.width;
    const indicatorLeftDiff =
        prevIndicatorStyles.left - afterIndicatorStyles.left;
    const widthToScaleTo = indicatorWidth + Math.abs(indicatorLeftDiff);
    const scaleXValue = widthToScaleTo / indicatorWidth;

    // if going from left to right, then the indicator needs to expand towards
    // the right ie. transform-origin -> right, else vice verse
    if (isGoingRight) activeDotIndicator.style.transformOrigin = "left";
    else activeDotIndicator.style.transformOrigin = "right";
    // Set the indicator to it's old position before starting the animation
    activeDotIndicator.style.left = `${indicatorLeftDiff}px`;

    const expandDotAnimation = expandActiveDotIndicator(
        activeDotIndicator,
        scaleXValue,
    );
    await expandDotAnimation.finished;
    // cleanup animation
    expandDotAnimation.commitStyles();
    expandDotAnimation.cancel();

    // reverse styles that were previously set
    // the indicator needs to shrink from the opp. side, so flip the transform-origin value
    if (isGoingRight) activeDotIndicator.style.transformOrigin = "right";
    else activeDotIndicator.style.transformOrigin = "left";
    // reset position of indicator
    activeDotIndicator.style.left = "";

    const shrinkDotAnimation = shrinkActiveDotIndicator(
        activeDotIndicator,
        scaleXValue,
    );
    await shrinkDotAnimation.finished;
    // reset all styles as the indicator is now in the position it should be
    shrinkDotAnimation.cancel();
    activeDotIndicator.removeAttribute("style");
}

function expandActiveDotIndicator(
    activeDotIndicator: HTMLDivElement,
    scaleXValue: number,
) {
    // We need to animate border-radius as well to keep the pill shape consistent
    // --dot-width is defined in CSS
    const expandDotAnimation = activeDotIndicator.animate(
        {
            transform: ["scaleX(1)", `scaleX(${scaleXValue})`],
            borderRadius: [
                "var(--dot-width) / var(--dot-width)",
                `calc(var(--dot-width) / ${scaleXValue}) / var(--dot-width)`,
            ],
        },
        activeDotIndicatorExpandAnimationOptions,
    );

    return expandDotAnimation;
}

function shrinkActiveDotIndicator(
    activeDotIndicator: HTMLDivElement,
    scaleXValue: number,
) {
    // --dot-width is defined in CSS
    const shrinkDotAnimation = activeDotIndicator.animate(
        {
            transform: [`scaleX(${scaleXValue})`, "scaleX(1)"],
            borderRadius: [
                `calc(var(--dot-width) / ${scaleXValue}) / var(--dot-width)`,
                "var(--dot-width) / var(--dot-width)",
            ],
        },
        activeDotIndicatorShrinkAnimationOptions,
    );

    return shrinkDotAnimation;
}
