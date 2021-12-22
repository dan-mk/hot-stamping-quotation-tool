import quoteReducer from "./quote";
import artReducer from "./art";
import artFragmentReducer from "./art_fragment";
import configurationReducer from "./configuration";
import { combineReducers } from 'redux';
import clicheReducer from "./cliche";

const allReducer = combineReducers({
    quotes: quoteReducer,
    arts: artReducer,
    art_fragments: artFragmentReducer,
    configurations: configurationReducer,
    cliches: clicheReducer,
});

export default allReducer;