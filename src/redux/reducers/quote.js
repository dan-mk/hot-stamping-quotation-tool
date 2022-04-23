import produce from "immer";

// const initialState = {
//     next_id: 1,
//     data: {}
// }

const initialState = {"next_id":2,"data":{"1":{"id":1,"client_id":1,"description":"Bag R","datetime":"2021-12-18 14:27"}}};

const quoteReducer = produce((draft, action) => {
    switch (action.type) {
        case 'ADD_QUOTE':
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

export default quoteReducer;
