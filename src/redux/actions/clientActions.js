import { SET_CLIENTS, SET_SELECTED_CLIENT } from "../constants/actionTypes";

export const setClients = (clients) => {
    return {
        type: SET_CLIENTS,
        payload: clients,
    };
};

export const setSelectedClient = (client) => {
    return {
        type: SET_SELECTED_CLIENT,
        payload: client,
    };
}
