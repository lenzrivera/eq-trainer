const cssModules = require('svelte-preprocess-cssmodules');

module.exports = {
    preprocess: [
        cssModules()
    ]
};