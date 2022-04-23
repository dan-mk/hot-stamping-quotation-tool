import produce from "immer";

// const initialState = {
//     next_id: 1,
//     data: {}
// }

const initialState = {"next_id":2,"data":{"1":{"id":1,"description":"Golden","color":"#ffdf0f","width":123,"length":12200,"price":123},"2":{"id":2,"description":"Red","color":"#ff0000","width":123,"length":12200,"price":123}}};

const foilTypeReducer = produce((draft, action) => {
    switch (action.type) {
        case 'ADD_FOIL_TYPE':
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

export default foilTypeReducer;