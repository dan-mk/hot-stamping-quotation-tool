export function getArtFragments(state, art) {
    return Object.values(state.art_fragments.data).filter(artFragment => artFragment.art_id === art.id);
}

export function getArtFragmentsByStep(state, configuration, art, step) {
    const allArtFragmentsIds = Object.values(configuration.arts[art.id].steps[step].foils.data).reduce((list, foil) => {
        return [...list, ...foil.art_fragments_ids];
    }, []);
    return Object.values(state.art_fragments.data).filter(artFragment => {
        return allArtFragmentsIds.includes(artFragment.id);
    });
}

export function getAllArtFragments(state, configuration) {
    const artIds = Object.values(state.arts.data).filter(art => art.quote_id === configuration.quote_id).map(art => art.id);
    return Object.values(state.art_fragments.data).filter(artFragment => {
        return artIds.includes(artFragment.art_id);
    });
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