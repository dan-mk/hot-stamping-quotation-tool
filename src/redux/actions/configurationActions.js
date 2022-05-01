import {
    SET_CONFIGURATIONS,
    SET_SELECTED_CONFIGURATION,
    ADD_CLICHE,
    DELETE_CLICHE,
    ADD_FOIL,
    DELETE_FOIL,
    ADD_STEP,
    DELETE_STEP,
} from "../constants/actionTypes";

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
};

export const addCliche = (configuration_id, art_id, step_id, art_fragments_ids, x, y, height, width, group_id = null) => {
    return {
        type: ADD_CLICHE,
        payload: {
            configuration_id,
            art_id,
            step_id,
            art_fragments_ids,
            x,
            y,
            height,
            width,
            group_id,
        }
    };
};

export const deleteCliche = (configuration_id, cliche_id) => {
    return {
        type: DELETE_CLICHE,
        payload: {
            configuration_id,
            cliche_id,
        }
    };
};

export const addFoil = (configuration_id, art_id, step_id, foil_type_id, art_fragments_ids, x, width) => {
    return {
        type: ADD_FOIL,
        payload: {
            configuration_id,
            art_id,
            step_id,
            foil_type_id,
            art_fragments_ids,
            x,
            width,
        }
    };
};

export const deleteFoil = (configuration_id, foil_id) => {
    return {
        type: DELETE_FOIL,
        payload: {
            configuration_id,
            foil_id,
        }
    };
};

export const addStep = (configuration_id, art_id) => {
    return {
        type: ADD_STEP,
        payload: {
            configuration_id,
            art_id,
        }
    };
};

export const deleteStep = (configuration_id, art_id, step_id) => {
    return {
        type: DELETE_STEP,
        payload: {
            configuration_id,
            art_id,
            step_id,
        }
    };
};
