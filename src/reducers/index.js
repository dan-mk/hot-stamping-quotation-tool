import quoteReducer from "./quote";
import artReducer from "./art";
import artFragmentReducer from "./art_fragment";
import configurationReducer from "./configuration";
import foilTypeReducer from "./foil_type";
import { combineReducers } from 'redux';

const allReducer = combineReducers({
    quotes: quoteReducer,
    arts: artReducer,
    art_fragments: artFragmentReducer,
    configurations: configurationReducer,
    foil_types: foilTypeReducer,
});

export default allReducer;