import quoteReducer from "./quote";
import artReducer from "./art";
import artFragmentReducer from "./art_fragment";
import configurationReducer from "./configuration";
import clicheReducer from "./cliche";
import foilTypeReducer from "./foil_type";
import { combineReducers } from 'redux';

const allReducer = combineReducers({
    quotes: quoteReducer,
    arts: artReducer,
    art_fragments: artFragmentReducer,
    configurations: configurationReducer,
    cliches: clicheReducer,
    foil_types: foilTypeReducer,
});

export default allReducer;