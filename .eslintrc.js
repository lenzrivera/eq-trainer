module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "svelte3"
    ],
    "overrides": [
        {
            "files": ["*.svelte"],
            "processor": "svelte3/svelte3"
        }
    ],
    "settings": {
        "svelte3/ignore-styles": attributes => attributes.module
    },
    "rules": {
    }
}
