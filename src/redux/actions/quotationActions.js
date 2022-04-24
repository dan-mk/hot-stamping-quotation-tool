import { SET_QUOTATIONS } from "../constants/actionTypes";

export const setQuotations = (quotations) => {
    return {
        type: SET_QUOTATIONS,
        payload: quotations,
    };
};