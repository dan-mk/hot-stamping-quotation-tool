import produce from "immer";

const initialState = {
    next_id: 1,
    data: {}
}

const clicheReducer = produce((draft, action) => {
    switch (action.type) {
        case 'ADD_CLICHE':
            draft.data[draft.next_id] = {
                id: draft.next_id,
                ...action.payload,
            };
            draft.next_id += 1;
            break;
        case 'DELETE_CLICHE':
            delete draft.data[action.payload.cliche_id];
            break;
        default:
            break;
    }
}, initialState);

export default clicheReducer;