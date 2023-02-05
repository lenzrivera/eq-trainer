<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    import Button from './Button.svelte';
    import Modal from './Modal.svelte';
</script>

<style>
    .description {
        margin: 2em 0 1.75em 0;

        font-size: 1.2em;
    }

    .heading {
        font-size: 2.5em;
        text-shadow: 0 0 0.3rem #ffffff80;
    }

    .link {
        color: white;
        font-weight: bold;
    }
</style>

<Modal>
    <h1 class="heading">eq-trainer</h1>

    <p class="description">
        Train yourself to recognize frequencies by listening to a pink noise
        sample and estimating its boosted frequency. Inspiration from
        <a class="link" href="https://www.youtube.com/watch?v=0fckQLQWhe0">this video</a>
        by Audio University.
    </p>

    <Button on:click={() => dispatch('startBtnClick')}>Let's Start!</Button>
</Modal>