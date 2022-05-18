export function getArtFragments(art) {
    return art.art_fragments;
}

export function getArtFragmentIdsByStep(configuration, art, step) {
    return Object.values(configuration.arts[art.index].steps[step].foils.data).reduce((list, foil) => {
        return [...list, ...foil.art_fragments_ids];
    }, []);
}

export function getAllArtFragments(configuration) {
    return configuration.quotation.arts.reduce((list, art) => {
        return [...list,...art.art_fragments];
    }, []);
}

export function isEverythingSet(configuration, allArtFragments) {
    const artFragmentsInCliches = Object.values(configuration.arts).reduce((list, art) => {
        return [...list, ...Object.values(art.steps).reduce((list2, step) => {
            return [...list2, ...Object.values(step.cliches.data).reduce((list3, cliche) => {
                return [...list3, ...cliche.art_fragments_ids];
            }, [])];
        }, [])];
    }, []);

    const artFragmentsInFoils = Object.values(configuration.arts).reduce((list, art) => {
        return [...list, ...Object.values(art.steps).reduce((list2, step) => {
            return [...list2, ...Object.values(step.foils.data).reduce((list3, cliche) => {
                return [...list3, ...cliche.art_fragments_ids];
            }, [])];
        }, [])];
    }, []);

    return allArtFragments.length === artFragmentsInCliches.length &&
            allArtFragments.length === artFragmentsInFoils.length &&
            allArtFragments.length > 0;
}

export function getAllUniqueCliches(configuration) {
    let allCliches = Object.values(configuration.arts).reduce((list, art) => {
        return [...list, ...Object.values(art.steps).reduce((list2, step) => {
            return [...list2, ...Object.values(step.cliches.data)];
        }, [])];
    }, []);
    return allCliches.filter((cliche, i) => allCliches.findIndex(c => c.group_id === cliche.group_id) === i);
}

export function getAllNonUniqueCliches(configuration) {
    let allCliches = Object.values(configuration.arts).reduce((list, art) => {
        return [...list, ...Object.values(art.steps).reduce((list2, step) => {
            return [...list2, ...Object.values(step.cliches.data)];
        }, [])];
    }, []);
    return allCliches.filter((cliche, i) => allCliches.findIndex(c => c.group_id === cliche.group_id) !== i);
}

export function getAllFoils(configuration) {
    return Object.values(configuration.arts).reduce((list, art) => {
        return [...list, ...Object.values(art.steps).reduce((list2, step) => {
            return [...list2, ...Object.values(step.foils.data)];
        }, [])];
    }, []);
}

export function pixelsToCm(pixels, dpi = 300) {
    return (pixels / dpi * 2.54).toFixed(2);
}

export function cmToPixels(cm, dpi = 300) {
    return parseInt(cm * dpi / 2.54);
}

export function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export function numOfDecimalPlaces(num) {
    var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(
        0,
        // Number of digits right of decimal point.
        (match[1] ? match[1].length : 0)
        // Adjust for scientific notation.
        - (match[2] ? +match[2] : 0));
}