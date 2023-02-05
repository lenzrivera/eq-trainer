<style>
    .button {
        padding: 0.9em 2.2em;

        color: white;
        font-family: Raleway, sans-serif;
        font-size: 1.1em;
        text-shadow: 0 0 0.3rem #ffffff80;

        background-color: #6e6e6e;
        border: none;
        border-radius: 0.35rem;
        box-shadow: inset 0 0 0.35rem 0 #b4b4b4bf;

        transition: scale 50ms ease-in-out;
    }

    .button:hover {
        filter: brightness(1.1);
    }

    .button:active {
        filter: brightness(0.8);
        scale: 0.95;
    }
</style>

<button class="button" on:click>
    <slot></slot>
</button>