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

export const addCliche = (art_id, step_id, art_fragments_ids, x, y, height, width, group_id = null) => {
    return {
        type: ADD_CLICHE,
        payload: {
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

export const deleteCliche = (cliche_id) => {
    return {
        type: DELETE_CLICHE,
        payload: {
            cliche_id,
        }
    };
};

export const addFoil = (art_id, step_id, foil_type_id, art_fragments_ids, x, width) => {
    return {
        type: ADD_FOIL,
        payload: {
            art_id,
            step_id,
            foil_type_id,
            art_fragments_ids,
            x,
            width,
        }
    };
};

export const deleteFoil = (foil_id) => {
    return {
        type: DELETE_FOIL,
        payload: {
            foil_id,
        }
    };
};

export const addStep = (art_id) => {
    return {
        type: ADD_STEP,
        payload: {
            art_id,
        }
    };
};

export const deleteStep = (art_id, step_id) => {
    return {
        type: DELETE_STEP,
        payload: {
            art_id,
            step_id,
        }
    };
};
