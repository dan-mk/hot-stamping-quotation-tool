import produce from "immer";
import { calculateCustomTotal, calculatePrices } from "../../helpers/quotation_instances";
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
            const { art_id, step_id, art_fragments_ids, x, y, height, width, group_id } = payload;
            const configuration = draft.selected;
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
            const { cliche_id } = payload;
            const configuration =  draft.selected;

            for (let artId in configuration.arts) {
                const art = configuration.arts[artId];
                for (let stepId in art.steps) {
                    const step = art.steps[stepId];
                    delete step.cliches.data[cliche_id];
                }
            }
        }   break;
        case ADD_FOIL: {
            const { art_id, step_id, foil_type_id, art_fragments_ids, x, width } = payload;
            const configuration =  draft.selected;
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
            const { foil_id } = payload;
            const configuration =  draft.selected;

            for (let artId in configuration.arts) {
                const art = configuration.arts[artId];
                for (let stepId in art.steps) {
                    const step = art.steps[stepId];
                    delete step.foils.data[foil_id];
                }
            }
        }   break;
        case ADD_STEP: {
            const { art_id } = payload;
            const art = draft.selected.arts[art_id];

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
            const { art_id, step_id } = payload;
            const art = draft.selected.arts[art_id];
            
            const previousSteps = Object.values(art.steps).filter(step => step.id != step_id);
            art.steps = {};

            previousSteps.forEach((step, i) => {
                step.id = i + 1;
                art.steps[step.id] = step;
            });
        }   break;
        case SET_FOIL_OFFSETS: {
            const { art_id, step_id, offsets } = payload;
            const configuration =  draft.selected;
            const step = configuration.arts[art_id].steps[step_id];

            step.foil_offsets = offsets;
        }   break;
        case ADD_QUOTATION_INSTANCE: {
            const configuration =  draft.selected;
            const { number_of_pages, foilTypes } = payload;

            if (!configuration.next_quotation_instance_id) {
                configuration.next_quotation_instance_id = 1;
            }

            if (!configuration.quotation_instances) {
                configuration.quotation_instances = {};
            }

            const { cliches, foils, production, total, totalOfStampings } = calculatePrices(configuration, { number_of_pages }, foilTypes);

            configuration.quotation_instances[configuration.next_quotation_instance_id] = {
                id: configuration.next_quotation_instance_id,
                number_of_pages,
                cliches: cliches,
                foils: foils,
                production: production,
                total: total,
                observations: '',
                totalOfStampings
            };
            configuration.next_quotation_instance_id += 1;
        } break;
        case DELETE_QUOTATION_INSTANCE: {
            const { quotation_instance_id } = payload;
            const configuration =  draft.selected;

            delete configuration.quotation_instances[quotation_instance_id];
        } break;
        case CUSTOMIZE_QUOTATION_INSTANCE_FOIL_PRICE: {
            const { quotation_instance_id, foil_id, price } = payload;
            const configuration =  draft.selected;

            console.log(configuration.quotation_instances[quotation_instance_id].foils[foil_id]);

            configuration.quotation_instances[quotation_instance_id].foils[foil_id].custom = price;

            configuration.quotation_instances[quotation_instance_id].total.custom = calculateCustomTotal(
                configuration.quotation_instances[quotation_instance_id]
            );
        } break;
        case CUSTOMIZE_QUOTATION_INSTANCE_CLICHE_PRICE: {
            const { quotation_instance_id, cliche_id, price } = payload;
            const configuration =  draft.selected;

            configuration.quotation_instances[quotation_instance_id].cliches[cliche_id].custom = price;

            configuration.quotation_instances[quotation_instance_id].total.custom = calculateCustomTotal(
                configuration.quotation_instances[quotation_instance_id]
            );
        } break;
        case CUSTOMIZE_QUOTATION_INSTANCE_PRODUCTION_PRICE: {
            const { quotation_instance_id, price } = payload;
            const configuration =  draft.selected;

            configuration.quotation_instances[quotation_instance_id].production.custom = price;

            configuration.quotation_instances[quotation_instance_id].total.custom = calculateCustomTotal(
                configuration.quotation_instances[quotation_instance_id]
            );
        } break;
        default:
            break;
    }
}, initialState);

export default configurationReducer;