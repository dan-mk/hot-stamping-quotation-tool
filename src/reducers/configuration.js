import produce from "immer";

// const initialState = {
//     next_id: 1,
//     data: {}
// }

const initialState = {"next_id":2,"data":{"1":{"id":1,"quote_id":1,"next_cliche_id":1,"next_cliche_group_id":1,"next_foil_id":1,"description":"Configuration 1","arts":{"1":{"id":1,"art_id":1,"steps":{"1":{"id":1,"cliches":{"data":{}},"foils":{"data":{}}}}}}}}}

const configurationReducer = produce((draft, action) => {
    switch (action.type) {
        case 'ADD_CONFIGURATION':
            draft.data[draft.next_id] = {
                id: draft.next_id,
                ...action.payload,
            };
            draft.next_id += 1;
            break;
        case 'ADD_CLICHE': {
            const { configuration_id, art_id, step_id, art_fragments_ids, x, y, height, width, group_id } = action.payload;
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
        case 'DELETE_CLICHE': {
            const { configuration_id, cliche_id } = action.payload;
            const configuration =  draft.data[configuration_id];

            for (let artId in configuration.arts) {
                const art = configuration.arts[artId];
                for (let stepId in art.steps) {
                    const step = art.steps[stepId];
                    delete step.cliches.data[cliche_id];
                    for (let foilId in step.foils.data) {
                        if (step.foils.data[foilId] && step.foils.data[foilId].cliches_ids.includes(cliche_id)) {
                            delete step.foils.data[foilId];
                        }
                    }
                }
            }
        }   break;
        case 'ADD_FOIL': {
            const { configuration_id, art_id, step_id, foil_type_id, cliches_ids, x, width } = action.payload;
            const configuration =  draft.data[configuration_id];
            const step = configuration.arts[art_id].steps[step_id];

            step.foils.data[configuration.next_foil_id] = {
                id: configuration.next_foil_id,
                foil_type_id,
                cliches_ids,
                x,
                width,
            };
            configuration.next_foil_id += 1;
        }   break;
        case 'DELETE_FOIL': {
            const { configuration_id, foil_id } = action.payload;
            const configuration =  draft.data[configuration_id];

            for (let artId in configuration.arts) {
                const art = configuration.arts[artId];
                for (let stepId in art.steps) {
                    const step = art.steps[stepId];
                    delete step.foils.data[foil_id];
                }
            }
        }   break;
        case 'ADD_STEP': {
            const { configuration_id, art_id } = action.payload;
            const art = draft.data[configuration_id].arts[art_id];

            const numOfSteps = Object.keys(art.steps).length;
            art.steps[numOfSteps + 1] = {
                id: numOfSteps + 1,
                cliches: { data: {} },
                foils: { data: {} }
            };
        }   break;
        default:
            break;
    }
}, initialState);

export default configurationReducer;