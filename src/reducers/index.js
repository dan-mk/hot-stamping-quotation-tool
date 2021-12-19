import quoteReducer from "./quote";
import artReducer from "./art";
import artFragmentReducer from "./art_fragment";
import configurationReducer from "./configuration";
import { combineReducers } from 'redux';

const allReducer = combineReducers({
    quotes: quoteReducer,
    arts: artReducer,
    art_fragments: artFragmentReducer,
    configurations: configurationReducer,
});

export default allReducer;