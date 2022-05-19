import { useDispatch } from 'react-redux';
import { isNumeric, numOfDecimalPlaces } from '../../../helpers';
import { setFoilMargin } from '../../../redux/actions/configurationActions';
import './../../../css/foil-margin.css';

export function FoilMargin(props) {
    const configuration = props.configuration;
    const isConfigurationFinished = props.isConfigurationFinished;

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const newValue = e.target.value.trim();
        if (!(newValue === '' || (isNumeric(newValue) && numOfDecimalPlaces(newValue) <= 1))) {
            return;
        }
        dispatch(setFoilMargin(newValue));
    };

    return (
        <div id="foil-margin-subcontainer">
            <header id="foil-margin-header">
                <h1>Foil margin</h1>
            </header>
            <div id="foil-margin-content">
                <input
                    readOnly={isConfigurationFinished}
                    value={configuration.arts['1'].foil_margin}
                    onChange={handleChange}
                    className="quotation-input" />
            </div>
        </div>
    )
}
