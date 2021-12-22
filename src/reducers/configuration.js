import produce from "immer";

// const initialState = {
//     next_id: 1,
//     data: {}
// }

const initialState = {"next_id":2,"data":{"1":{"id":1,"quote_id":1,"description":"Configuration 1","arts":{"1":{"id":1,"art_id":1,"steps":{"1":{"id":1,"sequence":1,"positioned_cliches":{},"foils":{}}}}}}}}

const configurationReducer = produce((draft, action) => {
    switch (action.type) {
        case 'ADD_CONFIGURATION':
            draft.data[draft.next_id] = {
                id: draft.next_id,
                ...action.payload,
            };
            draft.next_id += 1;
            break;
        case 'ADD_CLICHE_TO_STEP':
            const { configuration_id, art_id, step_id, cliche_id, art_fragments_ids, x, y } = action.payload;
            
            draft.data[configuration_id].arts[art_id].steps[step_id].positioned_cliches[cliche_id] = {
                id: cliche_id,
                cliche_id,
                art_fragments_ids,
                x,
                y,
            };
        default:
            break;
    }
}, initialState);

export default configurationReducer;