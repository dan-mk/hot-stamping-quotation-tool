import {
    SET_CONFIGURATIONS,
    SET_SELECTED_CONFIGURATION,
    ADD_CLICHE,
    DELETE_CLICHE,
    ADD_FOIL,
    DELETE_FOIL,
    ADD_STEP,
    DELETE_STEP,
    SET_FOIL_OFFSETS,
    ADD_QUOTATION_INSTANCE,
    DELETE_QUOTATION_INSTANCE,
    CUSTOMIZE_QUOTATION_INSTANCE_FOIL_PRICE,
    CUSTOMIZE_QUOTATION_INSTANCE_CLICHE_PRICE,
    CUSTOMIZE_QUOTATION_INSTANCE_PRODUCTION_PRICE,
    SET_FOIL_MARGIN,
    SET_QUOTATION_INSTANCE_DISCOUNT,
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

export const setFoilOffsets = (art_id, step_id, offsets) => {
    return {
        type: SET_FOIL_OFFSETS,
        payload: {
            art_id,
            step_id,
            offsets,
        }
    };
};

export const addQuotationInstance = (number_of_pages, foilTypes) => {
    return {
        type: ADD_QUOTATION_INSTANCE,
        payload: {
            number_of_pages,
            foilTypes,
        }
    };
};

export const deleteQuotationInstance = (quotation_instance_id) => {
    return {
        type: DELETE_QUOTATION_INSTANCE,
        payload: {
            quotation_instance_id,
        }
    };
};

export const customizeQuotationInstanceFoilPrice = (quotation_instance_id, foil_id, price) => {
    return {
        type: CUSTOMIZE_QUOTATION_INSTANCE_FOIL_PRICE,
        payload: {
            quotation_instance_id,
            foil_id,
            price,
        }
    };
};

export const customizeQuotationInstanceClichePrice = (quotation_instance_id, cliche_id, price) => {
    return {
        type: CUSTOMIZE_QUOTATION_INSTANCE_CLICHE_PRICE,
        payload: {
            quotation_instance_id,
            cliche_id,
            price,
        }
    };
};

export const customizeQuotationInstanceProductionPrice = (quotation_instance_id, price) => {
    return {
        type: CUSTOMIZE_QUOTATION_INSTANCE_PRODUCTION_PRICE,
        payload: {
            quotation_instance_id,
            price,
        }
    };
};

export const setFoilMargin = (foil_margin) => {
    return {
        type: SET_FOIL_MARGIN,
        payload: {
            foil_margin,
        }
    };
}

export const setDiscount = (quotation_instance_id, discount) => {
    return {
        type: SET_QUOTATION_INSTANCE_DISCOUNT,
        payload: {
            quotation_instance_id,
            discount,
        }
    };
}
