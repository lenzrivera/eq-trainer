<script>   
    import { MIN_FREQ, MAX_FREQ, genItem } from './js/items';
    import { NoisePlayer } from './js/NoisePlayer';

    import Button from './components/Button.svelte';
    import FrequencyPicker from './components/FrequencyPicker.svelte';
    import ResultModal from './components/ResultModal.svelte';
    import StartModal from './components/StartModal.svelte';

    let currentItem = genItem();
    let inputFrequency = 1149;

    const audioPlayer = new NoisePlayer();
    $: audioPlayer.boostedFrequency = currentItem.boostedFreq;
    audioPlayer.ticked.add(handleAudioTick);

    let audioRms;
    let audioWaveform;

    let showStartModal = true;
    let showResultModal = false;

    let frequencyPicker;

    // Handlers //

    async function handleAnswerSelect() {
        if (showStartModal || showResultModal) {
            return;
        }
        
        audioPlayer.stop();
        await waitFor(1000);

        frequencyPicker.disable();
        await frequencyPicker.showCorrectAnswer(currentItem.boostedFreq);
        await waitFor(1000);

        showResultModal = true;
    }

    function handleAudioTick() {
        audioRms = audioPlayer.currentRms;
        audioWaveform = audioPlayer.currentWaveform;
    }

    async function handleNextRound() {
        showResultModal = false;
        currentItem = genItem();

        await frequencyPicker.hideCorrectAnswer();
        frequencyPicker.enable();
        audioPlayer.start();
    }

    async function handleStartBtnClick() {        
        showStartModal = false;

        await frequencyPicker.playInitialAnimation();
        frequencyPicker.enable();
        audioPlayer.start();
    }

    // Helpers //

    function waitFor(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
</script>

<style>
    .game_screen {
        height: 100vh;
        overflow: hidden;
        
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        gap: 2.5em;

        /* Dark mode potential? #20252e */
        background-color: #f5f5f5;
    }
</style>

<div class="game_screen">
    <FrequencyPicker
        bind:frequency={inputFrequency}
        bind:this={frequencyPicker}
        currentWaveform={audioWaveform}
        currentWaveformRms={audioRms}
        min={MIN_FREQ}
        max={MAX_FREQ}
    />

    <Button on:click={handleAnswerSelect}>Select Frequency!</Button>

    {#if showResultModal}
        <ResultModal
            answeredFreq={inputFrequency}
            correctFreq={currentItem.boostedFreq}
            on:tryAgainBtnClick={handleNextRound}
        />
    {/if}

    {#if showStartModal}
        <StartModal on:startBtnClick={handleStartBtnClick} />
    {/if}
</div>