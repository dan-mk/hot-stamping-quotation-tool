import { SET_CONFIGURATIONS, SET_SELECTED_CONFIGURATION } from "../constants/actionTypes";

export const setConfigurations = (configurations) => {
    return {
        type: SET_CONFIGURATIONS,
        payload: configurations,
    };
};

export const setSelectedConfiguration = (configuration) => {
    return {
        type: SET_SELECTED_CONFIGURATION,
        payload: configuration,
    };
}
