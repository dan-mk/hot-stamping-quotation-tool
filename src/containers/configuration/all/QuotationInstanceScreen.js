import './../../../css/quotation-instance-screen.css';
import { Workspace } from './Workspace';
import api from './../../../helpers/api';
import { useDispatch } from 'react-redux';
import { customizeQuotationInstanceClichePrice, customizeQuotationInstanceFoilPrice, customizeQuotationInstanceProductionPrice } from '../../../redux/actions/configurationActions';

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function numOfDecimalPlaces(num) {
    var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(
        0,
        // Number of digits right of decimal point.
        (match[1] ? match[1].length : 0)
        // Adjust for scientific notation.
        - (match[2] ? +match[2] : 0));
}

export function QuotationInstanceScreen(props) {
    const configuration = props.configuration;
    const onClickClose = props.onClickClose;
    const quotationInstanceId = props.quotationInstanceId;
    const quotationInstance = props.quotationInstance;
    
    const quote = configuration.quotation;
    const arts = configuration.quotation.arts;

    const dispatch = useDispatch();

    const handleChangeProduction = (e) => {
        const newValue = e.target.value.trim();
        if (!(newValue === '' || (isNumeric(newValue) && numOfDecimalPlaces(newValue) <= 2))) {
            return;
        }
        dispatch(customizeQuotationInstanceProductionPrice(quotationInstanceId, newValue));
    };

    return (
        <div id="quotation-instance-container">
            <header>
                <div style={{ flexGrow: '1' }}>
                    <p>{ quote.description }</p>
                    <h1>{ configuration.description }</h1>
                </div>
                <img onClick={onClickClose} src="/times-solid.svg"/>
            </header>
            <div id="quotation-instance-content-container">
                <div id="quotation-instance-arts-container">
                    { arts.map(art => {
                        return (
                            <div key={art.id}>
                                <div className="quotation-instance-image-cell">
                                    <img src={`${api.defaults.baseURL}/uploads/arts/${art.id}.png`} />
                                </div>
                                <div className="quotation-instance-art-details-cell">
                                    <div>
                                        <p>Art {art.index}</p>
                                        <span>{quotationInstance.number_of_pages[art.id]} pages</span>
                                    </div>
                                </div>
                            </div>
                        );
                    }) }
                </div>
                <div id="quotation-instance-resources">
                    <h1>Resources</h1>
                    {
                        Object.values(configuration.arts).map((art, i) => {
                            return Object.values(art.steps).map((step, j) => {
                                return (
                                    <div key={i + '-' + j} className="quotation-instance-step-container">
                                        <div className="quotation-instance-step-image">                                    
                                            <Workspace 
                                                show={true}
                                                key={j}
                                                art={arts.find(a => a.id === art.art_id)}
                                                configuration={configuration}
                                                showOnlyPaper={true}
                                                step={step.id}
                                                paddingHorizontal={8}
                                                paddingVertical={32}
                                                zoomBase={1.02}
                                                isConfigurationFinished={true} />
                                        </div>
                                        <div className="quotation-instance-step-description">
                                            <h1>Art { art.id }, step { step.id }</h1>
                                            <div className="quotation-instance-step-price-table">
                                                <div className="quotation-instance-step-price-table-header">
                                                    <div>Resource</div>
                                                    <div>Regular price</div>
                                                    <div>Custom price</div>
                                                </div>
                                                {
                                                    Object.values(step.cliches.data).map(cliche => {
                                                        const handleChange = (e) => {
                                                            const newValue = e.target.value.trim();
                                                            if (!(
                                                                newValue === '' ||
                                                                (isNumeric(newValue) && numOfDecimalPlaces(newValue) <= 2)
                                                            )) {
                                                                return;
                                                            }
                                                            dispatch(
                                                                customizeQuotationInstanceClichePrice(
                                                                    quotationInstanceId,
                                                                    cliche.id,
                                                                    newValue
                                                                )
                                                            );
                                                        };
                                                        return (
                                                            <div className="quotation-instance-step-price-table-row" key={cliche.id}>
                                                                <div>Cliche { cliche.group_id }</div>
                                                                <div>$ { quotationInstance.cliches[cliche.id].regular }</div>
                                                                <div>
                                                                    <input
                                                                        className='quotation-input'
                                                                        value={quotationInstance.cliches[cliche.id].custom}
                                                                        onChange={handleChange} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                            <div className="quotation-instance-step-price-table">
                                                {
                                                    Object.values(step.foils.data).map(foil => {
                                                        const handleChange = (e) => {
                                                            const newValue = e.target.value.trim();
                                                            if (!(
                                                                newValue === '' ||
                                                                (isNumeric(newValue) && numOfDecimalPlaces(newValue) <= 2)
                                                            )) {
                                                                return;
                                                            }
                                                            dispatch(
                                                                customizeQuotationInstanceFoilPrice(
                                                                    quotationInstanceId,
                                                                    foil.id,
                                                                    newValue
                                                                )
                                                            )
                                                        };
                                                        return (
                                                            <div className="quotation-instance-step-price-table-row" key={foil.id}>
                                                                <div>Foil { foil.id }</div>
                                                                <div>$ { quotationInstance.foils[foil.id].regular }</div>
                                                                <div>
                                                                    <input
                                                                        className='quotation-input'
                                                                        value={quotationInstance.foils[foil.id].custom}
                                                                        onChange={handleChange} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                );
                            });
                        })
                    }
                </div>
                <div id="quotation-instance-production">
                    <h1>Production</h1>
                    <div className='quotation-instance-production-step-container'>
                        {
                             Object.values(configuration.arts).map(art => {
                                return Object.values(art.steps).map(step => {
                                    return (
                                        <div key={step.id} className="quotation-instance-production-step">
                                            <p>Art { art.id }, step { step.id }</p>
                                            <span>{ quotationInstance.number_of_pages[art.id] } stampings</span>
                                        </div>
                                    );
                                });
                            })
                        }
                    </div>
                    <div className='quotation-instance-production-price-container'>
                        <div className='quotation-instance-production-price-container-header'>
                            <div>Total of stampings</div>
                            <div>Regular price</div>
                            <div>Custom price</div>
                        </div>
                        <div>
                            <div>
                                { quotationInstance.totalOfStampings }
                            </div>
                            <div>$ { quotationInstance.production.regular }</div>
                            <div>
                                <input
                                    className='quotation-input'
                                    value={quotationInstance.production.custom}
                                    onChange={handleChangeProduction} />
                                </div>
                        </div>
                    </div>
                </div>
                <footer id="final-price-container">
                    <small>Final regular price: $ { quotationInstance.total.regular }</small><br />
                    Final custom price: $ { quotationInstance.total.custom }
                </footer>
            </div>
        </div>
    );
}