import produce from "immer";
import { SET_QUOTATIONS } from "../constants/actionTypes";

const initialState = {
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
        default:
            break;
    }
}, initialState);

export default quotationReducer;
