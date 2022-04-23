import { SET_CLIENTS, SET_CLIENT } from "../constants/actionTypes";

export const setClients = (clients) => {
    return {
        type: SET_CLIENTS,
        payload: clients,
    };
};

export const setClient = (client) => {
    return {
        type: SET_CLIENT,
        payload: client,
    };
};
