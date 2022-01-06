export const addQuote = (client_id, description, datetime) => {
    return {
        type: 'ADD_QUOTE',
        payload: {
            client_id,
            description,
            datetime,
        }
    }
};

export const addArt = (quote_id, dpi, height, width, base64) => {
    return {
        type: 'ADD_ART',
        payload: {
            quote_id,
            dpi,
            height,
            width,
            base64,
        }
    }
};

export const addArtFragment = (art_id, x, y, height, width, data) => {
    return {
        type: 'ADD_ART_FRAGMENT',
        payload: {
            art_id,
            x,
            y,
            height,
            width,
            data,
        }
    }
}

export const addConfiguration = (quote_id, description, art_ids) => {
    const arts = {};

    art_ids.map((art_id, index) => {
        arts[index + 1] = {
            id: index + 1,
            art_id,
            steps: {
                '1': {
                    id: 1,
                    cliches: { data: {} },
                    foils: { data: {} }
                }
            }
        }
    })

    return {
        type: 'ADD_CONFIGURATION',
        payload: {
            quote_id,
            next_cliche_id: 1,
            next_cliche_group_id: 1,
            next_foil_id: 1,
            description,
            arts: arts
        }
    }
}

export const addCliche = (configuration_id, art_id, step_id, art_fragments_ids, x, y, height, width, group_id = null) => {
    return {
        type: 'ADD_CLICHE',
        payload: {
            configuration_id,
            art_id,
            step_id,
            art_fragments_ids,
            x,
            y,
            height,
            width,
            group_id
        }
    };
}

export const deleteCliche = (configuration_id, cliche_id) => {
    return {
        type: 'DELETE_CLICHE',
        payload: {
            configuration_id,
            cliche_id 
        }
    };
};

export const addFoilType = (description, width, length, price) => {
    return {
        type: 'ADD_FOIL_TYPE',
        payload: {
            description,
            width,
            length,
            price,
        }
    };
};

export const addFoil = (configuration_id, art_id, step_id, foil_type_id, art_fragments_ids, x, width) => {
    return {
        type: 'ADD_FOIL',
        payload: {
            configuration_id,
            art_id,
            step_id,
            foil_type_id,
            art_fragments_ids,
            x,
            width
        }
    };
}

export const deleteFoil = (configuration_id, foil_id) => {
    return {
        type: 'DELETE_FOIL',
        payload: {
            configuration_id,
            foil_id 
        }
    };
};

export const addStep = (configuration_id, art_id) => {
    return {
        type: 'ADD_STEP',
        payload: {
            configuration_id,
            art_id
        }
    };
};

export const deleteStep = (configuration_id, art_id, step_id) => {
    return {
        type: 'DELETE_STEP',
        payload: {
            configuration_id,
            art_id,
            step_id
        }
    };
}