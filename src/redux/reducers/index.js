import clientReducer from "./client";
import quotationReducer from "./quotation";
import artReducer from "./art";
import artFragmentReducer from "./art_fragment";
import configurationReducer from "./configuration";
import foilTypeReducer from "./foil_type";
import uiReducer from "./ui";
import { combineReducers } from 'redux';

const allReducer = combineReducers({
    clients: clientReducer,
    quotations: quotationReducer,
    arts: artReducer,
    art_fragments: artFragmentReducer,
    configurations: configurationReducer,
    foil_types: foilTypeReducer,
    ui: uiReducer,
});

export default allReducer;
