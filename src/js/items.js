export const MIN_FREQ = 250;
export const MAX_FREQ = 16000;

export function genItem() {
    return { boostedFreq: randomValue(MIN_FREQ, MAX_FREQ, 10) };
}

function randomValue(min, max, interval) {
    const values = [];
    
    for (let v = min; v < max; v += interval) {
        values.push(v);
    }

    return values[Math.floor(values.length * Math.random())];
}