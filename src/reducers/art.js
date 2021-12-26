import produce from "immer";

const initialState = {
    next_id: 1,
    data: {}
}

// const initialState = {"next_id":3,"data":{"1":{"id":1,"quote_id":1,"dpi":300,"height":123,"width":456},"2":{"id":2,"quote_id":1,"dpi":300,"height":456,"width":123}}};

const artReducer = produce((draft, action) => {
    switch (action.type) {
        case 'ADD_ART':
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

export default artReducer;