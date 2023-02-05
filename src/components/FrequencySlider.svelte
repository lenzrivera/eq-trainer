<script>
    import { logScaleFrequency, inverseScaleFrequency } from '../js/frequencyTransforms';
    
    import Slider from './Slider.svelte';

    export let disabled = false;
    export let max = 24000;
    export let min = 20;
    export let value = 1000;

    $: scaledFrequency = logScaleFrequency(value, min, max);
</script>

<Slider 
    bind:value={value}
    color={`hsl(${scaledFrequency * 300}, 80%, 57%)`}
    {disabled}
    {max}
    {min}
    transform={{ toValue: inverseScaleFrequency, toRatio: logScaleFrequency }}
    on:slide
/>