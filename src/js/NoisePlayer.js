import { Signal } from 'signals';
import { Filter, Meter, NoiseSynth, Waveform } from 'tone';

const EQ_GAIN = 6; 
const WAVEFORM_SIZE = 256;

export class NoisePlayer {

    #filter = new Filter({
        type: 'peaking',
        gain: EQ_GAIN,
        Q: 0.67
    });
    #meterAnalyzer = new Meter({
        normalRange: true
    });
    #noiseSynth = new NoiseSynth({
        noise: { 
            type: 'pink' 
        },
        envelope: { 
            attack: 2, 
            sustain: 1 
        }
    });
    #signalInterval = null;
    #ticked = new Signal();
    #waveformAnalyzer = new Waveform(WAVEFORM_SIZE);

    constructor(boostedFreq = 0) {
        this.boostedFrequency = boostedFreq;

        this.#noiseSynth.connect(this.#filter);
        this.#filter.toDestination();

        this.#filter.connect(this.#meterAnalyzer);
        this.#filter.connect(this.#waveformAnalyzer);
    }

    get boostedFrequency() {
        return this.#filter.frequency.value;
    }

    set boostedFrequency(v) {
        this.#filter.frequency.value = v;
    }

    get currentRms() {
        return this.#meterAnalyzer.getValue();
    }

    get currentWaveform() {
        return this.#waveformAnalyzer.getValue();
    }

    get ticked() {
        return this.#ticked;
    }

    start() {
        this.#noiseSynth.triggerAttack();
        this.#signalInterval = setInterval(() => this.ticked.dispatch(), 20);
    }

    stop() {
        this.#noiseSynth.triggerRelease();
        clearInterval(this.#signalInterval);
    }

}