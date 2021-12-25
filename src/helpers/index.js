export function getConfigurationArts(state, configuration) {
    return Object.values(state.arts.data).filter(art => art.quote_id === configuration.quote_id);
}

export function getArtFragments(state, art) {
    return Object.values(state.art_fragments.data).filter(artFragment => artFragment.art_id === art.id);
}

export function getConfigurationCliches(state, configuration) {
    return Object.values(state.cliches.data).filter(cliche => cliche.configuration_id === configuration.id);
}

export function getNextClicheId(state) {
    return state.cliches.next_id;
}

export function getStepCliches(state, step) {
    const clicheIds = Object.keys(step.positioned_cliches);
    return clicheIds.map(clicheId => state.cliches.data[clicheId]);
}