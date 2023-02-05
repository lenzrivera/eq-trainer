<script>
    import { logScaleFrequency } from '../js/frequencyTransforms';
    import { interp } from '../js/interp';
    import { transitionend } from '../js/transitionend';

    import AudioViz from './AudioViz.svelte';
    import Markings from './Markings.svelte';
    import Wave from './Wave.svelte';
    import Wave2 from './Wave2.svelte';

    const MARKED_FREQUENCIES = 
        [50, 100, 200, 300, 500, 1000, 2000, 3000, 5000, 10000, 20000];

    export let currentWaveform = [];
    export let currentWaveformRms = 1;
    export let max = 24000;
    export let min = 20;
    export let value = 1000;

    let hideAnswerWave = true;
    let hideFrequencyText = true;
    let hideMainWave = true;
    let lowerMainWave = false;
    let scaledCorrectFrequency = null;

    let frequencyText;
    let mainWave;

    $: includedMarkedFreqs = MARKED_FREQUENCIES.filter(f => f >= min && f <= max);
    $: scaledFrequency = logScaleFrequency(value, min, max);

    // Exports //

    export async function hideCorrectAnswer() {
        lowerMainWave = false;
        hideAnswerWave = true;
        await mainWave.transitionend();
    }

    export async function playInitialAnimation() {
        hideMainWave = false;
        await mainWave.transitionend();

        hideFrequencyText = false;
        await transitionend(frequencyText);
    }

    export async function showCorrectAnswer(correctFreq) {
        hideAnswerWave = false;

        scaledCorrectFrequency = scaledFrequency;
        lowerMainWave = true;
        await interp(
            scaledFrequency, 
            logScaleFrequency(correctFreq, min, max), 
            600, 
            v => scaledCorrectFrequency = v, 
            t => t ** 2
        );
    }

    // Helpers //

    function getBgColor(scaledFrequency) {
        return `hsl(${scaledFrequency * 300}, 35%, 45%)`;
    }
    
    function getBgElemColor(scaledFrequency) {
        return `hsl(${scaledFrequency * 300}, 40%, 57%)`;
    }

    function getFreqColor(scaledFrequency) {
        return `hsl(${scaledFrequency * 300}, 93%, 70%)`;
    }
</script>

<style module>
    .audio_viz {
        width: 100%;
        height: 100%;
    }
    
    .frequency_display {
        position: relative;

        height: 17rem;
        overflow: hidden;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: var(--color);
        border-radius: 0.35rem;
    }

    .frequency_display::after {
        content: '';

        position: absolute;
        inset: 0;

        /* Let the inner glow go above all the other elements. */
        box-shadow: inset 0 0 0.8rem 0 rgb(255 255 255 / 0.5);
    }

    .frequency_display > * {
        position: absolute;
    }

    .frequency_text {        
        color: white;
        font-family: Raleway, sans-serif;
        font-size: 3.65em;
        font-weight: bold;
        text-shadow : 0 0 0.2rem rgb(255 255 255 / 0.5);
        
        user-select: none;

        transition: opacity 800ms ease-out;
    }

    .frequency_text.hidden {
        opacity: 0;
    }

    .markings {
        inset: 0;
    }

    .wave {
        height: 93%;
        bottom: 0;

        left: var(--x);
        translate: -50%;

        transition: height 500ms ease-out;
    }

    .wave.hidden {
        height: 0%;
    }

    .wave.lowered {
        height: 55%;
    }
</style>

<div 
    class="frequency_display"
    style="--color: {getBgColor(scaledFrequency)};"
>
    <AudioViz
        class="audio_viz"
        color={getBgElemColor(scaledFrequency)}
        rms={currentWaveformRms}
        waveform={currentWaveform}
    />

    <Markings
        class="markings"
        at={includedMarkedFreqs.map(f => logScaleFrequency(f, min, max))}
        color={getBgElemColor(scaledFrequency)}
    />

    <Wave2
        class="wave {hideAnswerWave ? 'hidden' : ''}"
        style="--x: {scaledCorrectFrequency * 100}%;"
        color={getFreqColor(scaledCorrectFrequency)}
    />

    <Wave
        bind:this={mainWave}
        class="wave {hideMainWave ? 'hidden' : ''} {lowerMainWave ? 'lowered' : ''}"
        style="--x: {scaledFrequency * 100}%;"
        color={getFreqColor(scaledFrequency)}
    />

    <p 
        class="frequency_text" 
        class:hidden={hideFrequencyText}
        bind:this={frequencyText} 
    >
        {Math.round(value)} Hz
    </p>
</div>