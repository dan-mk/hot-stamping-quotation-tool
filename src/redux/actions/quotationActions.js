import { SET_QUOTATIONS, SET_SELECTED_QUOTATION } from "../constants/actionTypes";

export const setQuotations = (quotations) => {
    return {
        type: SET_QUOTATIONS,
        payload: quotations,
    };
};

export const setSelectedQuotation = (quotation) => {
    return {
        type: SET_SELECTED_QUOTATION,
        payload: quotation,
    };
}
