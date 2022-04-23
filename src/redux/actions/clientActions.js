import { SET_CLIENTS } from "../constants/actionTypes";

export const setClients = (clients) => {
    return {
        type: SET_CLIENTS,
        payload: clients,
    };
};