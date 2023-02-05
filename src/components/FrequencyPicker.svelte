<script>
    import FrequencyDisplay from './FrequencyDisplay.svelte';
    import FrequencySlider from './FrequencySlider.svelte';
    
    export let currentWaveform = [];
    export let currentWaveformRms = 1;
    export let frequency = 1000;
    export let max = 24000;
    export let min = 20;
    
    let disabled = true;

    let frequencyDisplay;

    // Exports //

    export function disable() {
        disabled = true;
    }

    export function enable() {
        disabled = false;
    }

    export async function hideCorrectAnswer() {
        await frequencyDisplay.hideCorrectAnswer();
    }

    export async function playInitialAnimation() {
        await frequencyDisplay.playInitialAnimation();
    }

    export async function showCorrectAnswer(correctFreq) {
        await frequencyDisplay.showCorrectAnswer(correctFreq);
    }
</script>

<style>
    .frequency_picker {
        width: min(85vw, 83rem);
        height: 17rem;

        display: flex;
        flex-direction: column;
        gap: 2.25rem;
    }
</style>

<div class="frequency_picker">
    <FrequencyDisplay
        bind:this={frequencyDisplay}
        {currentWaveform}
        {currentWaveformRms}
        {max}
        {min}
        value={frequency}
    />

    <FrequencySlider 
        bind:value={frequency} 
        {disabled}
        {max} 
        {min} 
    />
</div>