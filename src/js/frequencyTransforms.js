const K = 0.08;

export function inverseScaleFrequency(scaledFrequency, min, max) {
    // Simple algebraic inverse of the formula used in logScaleFrequency()
    return (scaledFrequency * (max ** K - min ** K) + min ** K) ** (1 / K);
}

export function logScaleFrequency(frequency, min, max) {
    // Getting the (1/K)th root of frequency seems to be how frequencies
    // are scaled when visualized, and not via logarithms.
    return (frequency ** K - min ** K) / (max ** K - min ** K);
}