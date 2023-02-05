import * as Tone from 'tone';
import audio from 'url:./untitled.wav';

const eq = new Tone.EQ3({ lowFrequency: 5000, highFrequency: 5000, mid: 3 });
eq.toDestination();

const noise = new Tone.Noise('pink');
noise.connect(eq);

const noise2 = new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 0.5, sustain: 1 } });
noise2.connect(eq);

const eq2 = new Tone.Filter(5000, 'peaking');
eq2.gain.value = 6;
eq2.Q.value = 0.67;
eq2.toDestination();

const player = new Tone.Player(audio);
player.volume.value = -7.94;
player.connect(eq2);

// console.log(eq.Q.value);

window.onkeydown = (e) => {
    switch (e.key) {
        case 'a':
        case 'q':
            // noise2.triggerAttack();
            player.start();
            break;

        case 'd':
            // noise2.triggerRelease();
            player.stop();
            break;

        case 'e':
            eq2.gain.value = 0;

            // eq.lowFrequency.value += 100;
            // eq.highFrequency.value += 100;

            // console.log(eq.lowFrequency.value);
            // console.log(eq.highFrequency.value);
            break;

        case 'f':
            eq2.gain.value = 6;
            
            // eq.lowFrequency.value -= 100;
            // eq.highFrequency.value -= 100;

            // console.log(eq.lowFrequency.value);
            // console.log(eq.highFrequency.value);
            break;

        case 'g':
            eq.Q.value += 0.1;
            break;
    }
};