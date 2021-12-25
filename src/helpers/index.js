export function getConfigurationArts(state, configuration) {
    return Object.values(state.arts.data).filter(art => art.quote_id === configuration.quote_id);
}

export function getArtFragments(state, art) {
    return Object.values(state.art_fragments.data).filter(artFragment => artFragment.art_id === art.id);
}
