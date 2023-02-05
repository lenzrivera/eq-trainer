import { Draw, Loop, Meter, NoiseSynth, Player, Transport, Waveform } from 'tone';

import audio from 'url:./[葉月ゆら_Hatsuki Yura] 宵闇花火 _ Yoiyami Hanabi (japanese romaji lyrics) [9vruVXIQ-RM].mp3';

let stopTime = 0;

const noise = new NoiseSynth({        
    noise: { 
        type: 'pink' 
    },
    envelope: { 
        attack: 0.5, 
        sustain: 1 
    }
});
noise.toDestination();

const player = new Player();
player.toDestination();

// const player = noise;

const waveform = new Waveform(256);
player.connect(waveform);

const meter = new Meter();
meter.normalRange = true;
player.connect(meter);

const canvas = document.querySelector('#canvas');
const ctx2d = canvas.getContext('2d');

ctx2d.lineWidth = 5;
ctx2d.fillStyle = 'red';
ctx2d.lineJoin = "round";
ctx2d.strokeStyle = 'red';

// origin at center-left, +y above and -y below.
ctx2d.scale(1, -1);
ctx2d.translate(0, -canvas.height / 2);

function getCoords(values, i) {
    const amp = values[i];

    const x = ((i + 1) / values.length) * canvas.width;
    const y = amp * (0.8 * canvas.height / 2);

    return [x, y];
}

function draw() {
    // if (player.state === 'started') {
        ctx2d.clearRect(0, -canvas.height / 2, canvas.width, canvas.height);
        
        const amp = meter.getValue();
        
        ctx2d.beginPath();
        ctx2d.moveTo(0, 0);
        
        const values = waveform.getValue();
        for (let i = 0; i < values.length; i += 1) {
            const w = values[i];
    
            const x = ((i + 1) / values.length) * canvas.width;
            const y = (amp ** 0.35) * w * canvas.height / 2;
            ctx2d.lineTo(x, y);   
        }

        ctx2d.stroke();
    // }

    requestAnimationFrame(draw);
}

window.onkeydown = async ({ key }) => {
    if (key === 'q') {
        await player.load(audio);
        // player.triggerAttack();
        player.start(0, stopTime);
        Transport.start();
    }

    else if (key === 'w') {
        // player.triggerRelease();
        player.stop();
        stopTime = player.now();
    }
};

// var loop = new Loop(function(time){
// 	//instead of scheduling visuals inside of here
// 	//schedule a deferred callback with Tone.Draw

// 	Draw.schedule(function(){
// 		//this callback is invoked from a requestAnimationFrame
// 		//and will be invoked close to AudioContext time
//         draw();
// 	}, time) //use AudioContext time of the event

// }, "64n").start(0);

requestAnimationFrame(draw);