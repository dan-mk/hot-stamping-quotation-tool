import produce from "immer";
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

const initialState = {
    selected: null,
    data: {},
};

const configurationReducer = produce((draft, {type, payload}) => {
    switch (type) {
        case SET_CONFIGURATIONS:
            const data = {};
            payload.forEach(configuration => {
                data[configuration.id] = configuration;
            });
            draft.data = data;
            break;
        case SET_SELECTED_CONFIGURATION:
            draft.selected = payload;
            break;
        case ADD_CLICHE: {
            const { configuration_id, art_id, step_id, art_fragments_ids, x, y, height, width, group_id } = payload;
            const configuration =  draft.data[configuration_id];
            const step = configuration.arts[art_id].steps[step_id];

            step.cliches.data[configuration.next_cliche_id] = {
                id: configuration.next_cliche_id,
                group_id: (group_id ? group_id : configuration.next_cliche_group_id),
                art_fragments_ids,
                x,
                y,
                height,
                width
            };
            configuration.next_cliche_id += 1;
            if (!group_id) {
                configuration.next_cliche_group_id += 1;
            }
        }   break;
        case DELETE_CLICHE: {
            const { configuration_id, cliche_id } = payload;
            const configuration =  draft.data[configuration_id];

            for (let artId in configuration.arts) {
                const art = configuration.arts[artId];
                for (let stepId in art.steps) {
                    const step = art.steps[stepId];
                    delete step.cliches.data[cliche_id];
                }
            }
        }   break;
        case ADD_FOIL: {
            const { configuration_id, art_id, step_id, foil_type_id, art_fragments_ids, x, width } = payload;
            const configuration =  draft.data[configuration_id];
            const step = configuration.arts[art_id].steps[step_id];

            step.foils.data[configuration.next_foil_id] = {
                id: configuration.next_foil_id,
                foil_type_id,
                art_fragments_ids,
                x,
                width,
            };
            configuration.next_foil_id += 1;
        }   break;
        case DELETE_FOIL: {
            const { configuration_id, foil_id } = payload;
            const configuration =  draft.data[configuration_id];

            for (let artId in configuration.arts) {
                const art = configuration.arts[artId];
                for (let stepId in art.steps) {
                    const step = art.steps[stepId];
                    delete step.foils.data[foil_id];
                }
            }
        }   break;
        case ADD_STEP: {
            const { configuration_id, art_id } = payload;
            const art = draft.data[configuration_id].arts[art_id];

            const numOfSteps = Object.keys(art.steps).length;
            art.steps[numOfSteps + 1] = {
                id: numOfSteps + 1,
                cliches: {
                    data: {},
                },
                foils: {
                    data: {},
                },
            };
        }   break;
        case DELETE_STEP: {
            const { configuration_id, art_id, step_id } = payload;
            const art = draft.data[configuration_id].arts[art_id];
            
            const previousSteps = Object.values(art.steps).filter(step => step.id != step_id);
            art.steps = {};

            previousSteps.forEach((step, i) => {
                step.id = i + 1;
                art.steps[step.id] = step;
            });
        }   break;
        default:
            break;
    }
}, initialState);

export default configurationReducer;