<script>
    import { onMount, tick } from 'svelte';
    
    export let color = 'white';
    export let rms = 1;
    export let rmsScaleFactor = 0.35;
    export let waveform = [];

    let canvasElem, ctx2d;
    $: if (ctx2d) ctx2d.strokeStyle = color;
    $: handleDataChange(rms, waveform);

    onMount(async () => {
        await tick();
        ctx2d = canvasElem.getContext('2d');
        handleWindowResize();
    });

    // Handlers //

    function handleDataChange() {
        requestAnimationFrame(() => drawWaveform(rms, waveform));
    }

    function handleWindowResize() {
        // Rendering attributes are reset on resize for some reason.
        sizeCanvasToCSSDimensions();
        setCanvasRenderingAttributes();
    }

    // Helpers //

    function drawWaveform(rms, waveform) {
        ctx2d.clearRect(0, -canvasElem.height / 2, canvasElem.width, canvasElem.height);
        
        ctx2d.beginPath();
        ctx2d.moveTo(0, 0);
        
        for (let i = 0; i < waveform.length; i += 1) {
            const value = waveform[i];
    
            const x = ((i + 1) / waveform.length) * canvasElem.width;
            const y = (rms ** rmsScaleFactor) * value * canvasElem.height / 2;
            ctx2d.lineTo(x, y);   
        }

        ctx2d.stroke();
    }

    function setCanvasRenderingAttributes() {
        ctx2d.lineJoin = 'round';
        ctx2d.lineWidth = 11;
        ctx2d.strokeStyle = color;

        // Origin at center-left, +y above and -y below center line.
        ctx2d.resetTransform();
        ctx2d.scale(1, -1);
        ctx2d.translate(0, -canvasElem.height / 2);
    }

    function sizeCanvasToCSSDimensions() {
        canvasElem.width = canvasElem.clientWidth;
        canvasElem.height = canvasElem.clientHeight;
    }
</script>

<svelte:window on:resize={handleWindowResize} />

<canvas class="audio_viz {$$props.class}" bind:this={canvasElem}>
    Your browser doesn't support <code>canvas</code>???
</canvas>