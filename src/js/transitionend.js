export function transitionend(elem) {
    return new Promise(resolve => {
        elem.addEventListener('transitionend', resolve, { once: true });
    });
}