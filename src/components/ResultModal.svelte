<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    import Button from './Button.svelte';
    import Modal from './Modal.svelte';
    
    export let answeredFreq;
    export let correctFreq;

    $: dFreq = correctFreq - answeredFreq;
    $: dFreqPercent = 100 * dFreq / answeredFreq;

    $: dFreqRounded = Math.round(dFreq);
    $: dFreqPercentRounded = Math.round(dFreqPercent);
</script>

<style>
    .correct_freq {
        margin-bottom: 0.175em;

        font-size: 3em;
        font-weight: bold;
        text-shadow: 0 0 0.3rem #ffffff80;
    }

    .dist_stats {
        font-size: 1.5em;
        font-weight: bold;
        text-shadow: 0 0 0.2rem #ffffff80;
    }

    .heading {
        font-size: 1.5em;
        font-weight: normal;
    }

    .text_container {
        margin: 1.25em 0 2em 0;
    }
</style>

<Modal class="result_modal">
    <h1 class="heading">Correct Frequency:</h1>

    <div class="text_container">
        <p class="correct_freq">{correctFreq} Hz</p>
        <p class="dist_stats">{dFreqRounded} Hz ({dFreqPercentRounded}%) Off</p>
    </div>

    <Button on:click={() => dispatch('tryAgainBtnClick')}>Try Again!</Button>
</Modal>