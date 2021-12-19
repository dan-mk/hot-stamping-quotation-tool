import produce from "immer";

// const initialState = {
//     next_id: 1,
//     data: {}
// }

const initialState = {"next_id":4,"data":{"1":{"id":1,"art_id":1,"x":12,"y":34,"height":12,"width":34,"data":[[]]},"2":{"id":2,"art_id":1,"x":78,"y":56,"height":34,"width":12,"data":[[]]},"3":{"id":3,"art_id":2,"x":78,"y":56,"height":34,"width":12,"data":[[]]}}};

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