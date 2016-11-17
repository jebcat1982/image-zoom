{
    // The id is used as a query parameter in the src of the <script> tag.
    "id": "canvas",
    "paths": ["../src"],
    "inputs": [
    "../src/nx.Index.js"
    ],
    "mode": "RAW", // RAW, WHITESPACE, SIMPLE, ADVANCED
    "level": "VERBOSE",  // QUIET, DEFAULT, and VERBOSE
    "checks": {
        // acceptable values are "ERROR", "WARNING", and "OFF"
        "deprecated": "WARNING",
        "checkTypes": "WARNING",
        "nonStandardJsDocs": "WARNING",
        "checkRegExp": "WARNING",
        "checkTypes": "WARNING",
        "checkVars": "WARNING",
        "deprecated": "WARNING",
        "fileoverviewTags": "WARNING",
        "invalidCasts": "WARNING",
        "missingProperties": "WARNING",
        "nonStandardJsDocs": "WARNING",
        "undefinedVars": "WARNING"
    }
}