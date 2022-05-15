import { SET_LOADING } from "../constants/actionTypes";

export const setLoading = (status) => {
    return {
        type: SET_LOADING,
        payload: {
            status
        }
    };
};