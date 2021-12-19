import produce from "immer";

// const initialState = {
//     next_id: 1,
//     data: {}
// }

const initialState = {"next_id":2,"data":{"1":{"id":1,"art_id":1,"x":0,"y":0,"height":12,"width":34,"data":[[]]}}};

const artFragmentReducer = produce((draft, action) => {
    switch (action.type) {
        case 'ADD_ART_FRAGMENT':
            draft.data[draft.next_id] = {
                id: draft.next_id,
                ...action.payload,
            };
            draft.next_id += 1;
            break;
        default:
            break;
    }
}, initialState);

export default artFragmentReducer;