import produce from "immer";
import { SET_QUOTATIONS, SET_SELECTED_QUOTATION } from "../constants/actionTypes";

const initialState = {
    selected: null,
    data: {},
};

const quotationReducer = produce((draft, { type, payload }) => {
    switch (type) {
        case SET_QUOTATIONS:
            const data = {};
            payload.forEach(quotation => {
                data[quotation.id] = quotation;
            });
            draft.data = data;
            break;
        case SET_SELECTED_QUOTATION:
            draft.selected = payload;
            break;
        default:
            break;
    }
}, initialState);

export default quotationReducer;
