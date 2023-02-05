export function interp(from, to, msDuration, callback, easing = t => t) {
    const d = to - from;

    return linear(msDuration, t => {
        callback(from + d * easing(t));
    });
}

export function linear(msDuration, callback) {
    let loopId;
    let prevTimestamp;
    
    return new Promise(resolve => {
        let elapsedMsTime = 0;
        
        function update(currTimestamp) {
            const dt = currTimestamp - prevTimestamp;
            prevTimestamp = currTimestamp;
            elapsedMsTime += dt;

            const timeRatio = Math.min(elapsedMsTime / msDuration, 1);
            callback(timeRatio);

            if (timeRatio === 1) {
                resolve();
                cancelAnimationFrame(loopId);
                return;
            }

            loopId = requestAnimationFrame(update);
        }

        prevTimestamp = performance.now();
        loopId = requestAnimationFrame(update);
    });
}