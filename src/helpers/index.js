export function getArtFragments(art) {
    return art.art_fragments;
}

export function getArtFragmentIdsByStep(configuration, art, step) {
    return Object.values(configuration.arts[art.id].steps[step].foils.data).reduce((list, foil) => {
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