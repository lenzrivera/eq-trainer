<script>
    import { fade } from 'svelte/transition';
</script>

<style>
    .modal {
        position: fixed;
        
        max-width: 26rem;
        margin: 1.25rem;
        padding: 2.75em;

        display: flex;
        flex-direction: column;

        color: white;
        font-family: Raleway, sans-serif;
        text-align: center;

        background-color: #060505e8;
        border-radius: 0.35rem;
        box-shadow: inset 0 0 0.8rem #ffffff80, 0 0 0 100vw #00000050;
    }
</style>

<div class="modal {$$props.class}" transition:fade={{ duration: 650 }}>
    <slot></slot>
</div>