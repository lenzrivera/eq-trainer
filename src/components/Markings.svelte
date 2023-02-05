<script>   
    export let at = [];
    export let color = 'white';
</script>

<style>
    .marking {
        width: 0.25rem;
        height: 100%;
        
        position: absolute;
        translate: -50% 0;
        left: var(--x);
        
        background: var(--color);
        box-shadow: 0 0 0.25rem 0 var(--color);
    }
</style>

<div class="markings {$$props.class}">
    {#each at as xRatio}
        <span 
            class="marking" 
            style="--color: {color}; --x: {xRatio * 100}%;"
        ></span>
    {/each}
</div>