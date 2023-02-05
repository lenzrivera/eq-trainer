<script>
    import chroma from 'chroma-js';
    import { createEventDispatcher, onMount, tick } from 'svelte';
    const dispatch = createEventDispatcher();
    
    export let color = 'white';
    export let disabled = false;
    export let min = 0
    export let max = 100;
    export let transform = { toValue: linearToValue, toRatio: linearToRatio };
    export let value = 50;
    
    let isDragging = false;
    let dragXOffset = 0;

    // Can't cleanly do this with computed state due to their nature.
    let progressRatio = transform.toRatio(value, min, max);
    let renderRatio = 0;

    let sliderElem;
    let thumbElem;

    onMount(async () => {
        await tick();
        renderRatio = computeRenderRatio(progressRatio);
    });

    // Handlers //

    function handleThumbDown(pointerX) {
        if (disabled) {
            return;
        }

        isDragging = true;

        // Drag the thumb by the point where it was clicked/touched.
        const { x: thumbX } = thumbElem.getBoundingClientRect();
        dragXOffset = pointerX - thumbX;
    }

    function handleThumbMove(pointerX) {
        if (isDragging) {
            setRatios(computeValueRatio(pointerX - dragXOffset));
        }
    }

    function handleThumbUp() {
        isDragging = false;
        dragXOffset = 0;
    }

    function handleTrackPress(pointerX, target) {
        if (disabled || target == thumbElem) {
            return;
        }

        const { width: thumbWidth } = thumbElem.getBoundingClientRect();
        setRatios(computeValueRatio(pointerX - thumbWidth / 2));

        // Allow the thumb to be dragged immediately after changing its position
        // via just clicking/touching the track.
        isDragging = true;
        dragXOffset = thumbWidth / 2;
    }

    // Helpers //

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    function computeRenderRatio(ratio) {
        const { width: sliderWidth } = sliderElem.getBoundingClientRect();
        const { width: thumbWidth } = thumbElem.getBoundingClientRect();

        // Setting left: alignRatio would move the leftmost part of the thumb
        // to the leftmost edge of the track.
        const alignRatio = (thumbWidth / 2) / sliderWidth;
        return ratio * (1 - 2 * alignRatio) + alignRatio;
    }

    /**
     * Represents how much the leftmost side of the thumb has travelled along the 
     * track.
     */
    function computeValueRatio(thumbX) {
        const { x: sliderX } = sliderElem.getBoundingClientRect();

        const ratio = (thumbX - sliderX) / getSlidableTrackWidth();
        return clamp(ratio, 0, 1);
    }

    /**
     * Ensures that the center of the thumb is aligned with the edges of the track
     * at not only the minimum but also the maximum value.
     */
    function getSlidableTrackWidth() {
        const { width: sliderWidth } = sliderElem.getBoundingClientRect();
        const { width: thumbWidth } = thumbElem.getBoundingClientRect(); 

        return sliderWidth - thumbWidth;
    }

    function linearToRatio(value, min, max) {
        return (value - min) / (max - min);
    }

    function linearToValue(ratio, min, max) {
        return ratio * (max - min) + min;
    }

    function setRatios(progressRatio) {
        progressRatio = progressRatio;

        value = transform.toValue(progressRatio, min, max);
        renderRatio = computeRenderRatio(progressRatio);

        dispatch('slide', value);
    }
</script>

<style>
    .slider {
        position: relative;

        width: 100%;
        height: 0.75rem;

        background-color: #b5b5b5;
        border-radius: 0.2rem;
        box-shadow: inset 0 0 0.35rem 0 #ffffffbf;
    }

    .thumb {
        position: absolute;
        left: var(--x);

        /* Anchor the thumb at its center. No idea why an extra 1% is needed to 
        align the thumb at the edges of the track correctly. */
        top: 50%;
        translate: -51% -50%;

        width: 2.55rem;
        height: 2.55rem;

        cursor: pointer;
        
        /* No highlighting in webkit browsers for touchscreen devices */
        -webkit-tap-highlight-color: transparent;
    }

    .thumb.disabled {
        cursor: auto;
    }

    /* Need to use pseudoelements to implement stroke and fill as box-shadow
    can't be invidiually applied on them otherwise. */
    .thumb::before, .thumb::after {
        content: '';

        position: absolute;
        border-radius: 50%;
    }

    /* Stroke */
    .thumb::before {
        inset: 0;

        background: #6e6e6e;
        box-shadow: inset 0 0 0.35rem 0 #b4b4b4bf;
    }

    /* Fill */
    .thumb::after {
        inset: 0.52rem;

        background: var(--color);
        box-shadow: inset 0 0 0.35rem 0 var(--glow-color);
    }
</style>

<svelte:window 
    on:mousemove={({ clientX }) => handleThumbMove(clientX)}
    on:mouseup={handleThumbUp}
    on:touchmove={({ targetTouches }) => handleThumbMove(targetTouches[0].clientX)}
    on:touchend={handleThumbUp}
/>

<div 
    bind:this={sliderElem} 
    class="slider" 
    on:mousedown={({ clientX, target }) => handleTrackPress(clientX, target)}
    on:touchstart={({ target, targetTouches }) => handleTrackPress(targetTouches[0].clientX, target)}
>
    <!-- Can't use the drag event since it sets the cursor position to (0, 0)
    upon ending the drag and there seems to be no way to detect such an end
    state and ignore it accordingly. -->
    <span 
        bind:this={thumbElem}
        class="thumb"
        class:disabled
        style="
            --color: {color};
            --glow-color: {chroma(color).brighten(1.5).alpha(0.75)};
            --x: {renderRatio * 100}%;"
        aria-valuenow={value}
        aria-valuemax={max}
        aria-valuemin={min}
        role="slider"
        on:mousedown={({ clientX }) => handleThumbDown(clientX) }
        on:touchstart={({ targetTouches }) => handleThumbDown(targetTouches[0].clientX)}
    ></span>
</div>