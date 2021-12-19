export function getConfigurationArts(state, configuration) {
    return Object.values(state.arts.data).filter(art => art.quote_id === configuration.quote_id);
}