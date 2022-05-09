import { getAllFoils, getAllUniqueCliches, getAllNonUniqueCliches, pixelsToCm } from './../../../helpers';
import { QuotationInstanceScreen } from './QuotationInstanceScreen';
import { useSelector } from 'react-redux';
import './../../../css/quotation-screen.css';
import { useState } from 'react';
import { getClichePrice, getFoilPrice, getProductionPrice, getTotalPrice } from './../../../config/Formulas';
import api from './../../../helpers/api';

export function OverallQuotationScreen(props) {
    const configuration = props.configuration;
    const onClickClose = props.onClickClose;
    const quotationInstances = props.quotationInstances;
    const setQuotationInstances = props.setQuotationInstances;
    const addQuotationInstance = props.addQuotationInstance;

    const quote = configuration.quotation;
    const arts = configuration.quotation.arts;
    const foilTypes = useSelector(state => state.foil_types.data);
    
    const [showQuotationInstanceScreen, setShowQuotationInstanceScreen] = useState(false);
    const [selectedQuotationInstanceId, setSelectedQuotationInstanceId] = useState(null);
    let selectedQuotationInstanceData = {};

    const onClickCloseInstance = () => {
        setShowQuotationInstanceScreen(false);
    };

    return (
        <>
        <div id="quotation-container">
            <header>
                <div style={{ flexGrow: '1' }}>
                    <p>{ quote.description }</p>
                    <h1>{ configuration.description }</h1>
                </div>
                <img onClick={onClickClose} src="/times-solid.svg"/>
            </header>
            <div id="overall-quotation-content-container">
                <div>
                    <div></div>
                    { arts.map((art, i) => {
                        return <div key={i} className="overall-quotation-image-cell">
                            <img src={`${api.defaults.baseURL}/uploads/arts/${art.id}.png`} />
                        </div>
                    }) }
                    <div></div>
                </div>
                <div>
                    <div></div>
                    { arts.map((art, i) => <div key={i} className="overall-quotation-title-cell">Art {art.id}</div>) }
                    <div></div>
                </div>
                <div>
                    <div></div>
                    { arts.map((_, i) => <div key={i} className="overall-quotation-header-cell">Number of pages</div>) }
                    <div className="overall-quotation-header-cell">Price</div>
                </div>
                { Object.values(quotationInstances.data).map((quotationInstance, i) => {
                    const areAllValuesFilled = arts.reduce((arePreviousValuesFilled, art) => {
                        return arePreviousValuesFilled && quotationInstance.number_of_pages[art.index];
                    }, true);

                    const clichePrices = {};
                    const foilPrices = {};
                    let totalOfStampings = 0;
                    let productionPrice = 0;
                    let totalPrice = 0;
                    let totalCustomPrice = 0;
                    if (areAllValuesFilled) {
                        const cliches = getAllUniqueCliches(configuration);
                        const nonUniqueCliches = getAllNonUniqueCliches(configuration);
                        const foils = getAllFoils(configuration);
                    
                        cliches.forEach(cliche => {
                            clichePrices[cliche.id] = parseFloat(getClichePrice(
                                parseFloat(pixelsToCm(cliche.width)),
                                parseFloat(pixelsToCm(cliche.height))
                            ).toFixed(2));
                        });

                        nonUniqueCliches.forEach(cliche => {
                            clichePrices[cliche.id] = 0;
                        });
                    
                        for (let artId in quotationInstance.number_of_pages) {
                            const qtdSteps = Object.values(configuration.arts[artId].steps).length;
                            totalOfStampings += quotationInstance.number_of_pages[artId] * qtdSteps;
                        }

                        foils.forEach(foil => {
                            let artId;
                            Object.values(configuration.arts).forEach((art, i) => {
                                Object.values(art.steps).forEach(step => {
                                    Object.values(step.foils.data).forEach(f => {
                                        if (f.id === foil.id) {
                                            artId = i + 1;
                                        }
                                    });
                                });
                            });

                            let stepId;
                            Object.values(configuration.arts).forEach(art => {
                                Object.values(art.steps).forEach(step => {
                                    Object.values(step.foils.data).forEach(f => {
                                        if (f.id === foil.id) {
                                            stepId = step.id;
                                        }
                                    });
                                });
                            });

                            const foilUse = configuration.arts[artId].steps[stepId].foil_offsets;
                            const avgHeight = foilUse.reduce((sum, n) => sum + n, 0) / foilUse.length;

                            const foilType = foilTypes[foil.foil_type_id];
                            const foilRollWidthCm = foilType.width;
                            const foilRollLengthCm = foilType.length;
                            const foilRollPrice = foilType.price;

                            const stampingsForStep = quotationInstance.number_of_pages[artId];

                            foilPrices[foil.id] = parseFloat(
                                getFoilPrice(
                                    parseFloat(pixelsToCm(foil.width)),
                                    parseFloat(pixelsToCm(avgHeight * stampingsForStep)),
                                    foilRollWidthCm,
                                    foilRollLengthCm,
                                    foilRollPrice
                                ).toFixed(2)
                            );
                        });
                    
                        const totalClichePrice = Object.values(clichePrices).reduce((sum, v) => sum + v, 0);
                        const totalFoilPrice = Object.values(foilPrices).reduce((sum, v) => sum + v, 0);
                        productionPrice = parseFloat(getProductionPrice(totalOfStampings).toFixed(2));
                    
                        totalPrice = getTotalPrice(totalClichePrice, totalFoilPrice, productionPrice);

                        if (quotationInstance.locked) {
                            const totalCustomClichePrice = Object.values(quotationInstance.cliche_price).reduce((sum, v) => sum + parseFloat(v || 0), 0);
                            const totalCustomFoilPrice = Object.values(quotationInstance.foil_price).reduce((sum, v) => sum + parseFloat(v || 0), 0);
                            const productionCustomPrice = parseFloat(quotationInstance.production_price || 0);
                        
                            totalCustomPrice = getTotalPrice(totalCustomClichePrice, totalCustomFoilPrice, productionCustomPrice);
                        }
                        
                    }

                    const onClickDelete = () => {
                        setQuotationInstances(draft => {
                            delete draft.data[quotationInstance.id];
                        });
                    };

                    if (showQuotationInstanceScreen && selectedQuotationInstanceId === quotationInstance.id) {
                        selectedQuotationInstanceData = {
                            clichePrices: {...clichePrices},
                            foilPrices: {...foilPrices},
                            totalOfStampings,
                            productionPrice,
                            totalPrice,
                            totalCustomPrice
                        };
                    }

                    const onClickCustomize = () => {
                        setQuotationInstances(draft => {
                            if (draft.data[quotationInstance.id].locked === false) {
                                draft.data[quotationInstance.id].cliche_price = {...clichePrices};
                                draft.data[quotationInstance.id].foil_price = {...foilPrices};
                                draft.data[quotationInstance.id].production_price = productionPrice;
                                draft.data[quotationInstance.id].locked = true;
                            }
                        });
                        setSelectedQuotationInstanceId(quotationInstance.id);
                        setShowQuotationInstanceScreen(true);
                    };

                    return (
                        <div key={i} className="overall-quotation-options-row">
                            <div style={{ margin: '5px 0 0' }}>{ i + 1 }</div>
                            { arts.map((art, j) => {
                                const handleChange = (e) => {
                                    setQuotationInstances(draft => {
                                        const number_of_pages = draft.data[quotationInstance.id].number_of_pages;
                                        const newValue = e.target.validity.valid ? e.target.value : number_of_pages[art.index];
                                        number_of_pages[art.index] = newValue === '' ? '' : parseInt(newValue);
                                    });
                                };

                                return (<div key={j}>
                                    <input
                                        pattern="[0-9]{0,6}"
                                        value={quotationInstance.number_of_pages[art.index]}
                                        onChange={handleChange}
                                        readOnly={quotationInstance.locked}
                                        className="quotation-input" />
                                </div>);
                            }) }
                            <div>
                                <span className="overall-quotation-price">
                                    $ { areAllValuesFilled ? (quotationInstance.locked ? totalCustomPrice.toFixed(2) : totalPrice.toFixed(2)) : '---' + areAllValuesFilled }
                                </span>
                                <button 
                                    className={"quotation-button" + (areAllValuesFilled ? "" : " quotation-button-disabled")}
                                    onClick={onClickCustomize}>
                                    Customize
                                </button>
                                { Object.values(quotationInstances.data).length > 1 &&
                                    <img src="/times-solid.svg" onClick={onClickDelete} style={{ width: '12px', cursor: 'pointer' }}/> }
                            </div>
                        </div>
                    );
                }) }
                <div className="overall-quotation-add-row">
                    <div></div>
                    <div>
                        <button className="quotation-button" onClick={addQuotationInstance}>Add</button>
                    </div>
                    <div></div>
                    <div></div>
                </div>

            </div>
        </div>
        { showQuotationInstanceScreen && <QuotationInstanceScreen
                                            configuration={configuration}
                                            onClickClose={onClickCloseInstance}
                                            quotationInstance={quotationInstances.data[selectedQuotationInstanceId]}
                                            setQuotationInstances={setQuotationInstances}
                                            clichePrices={selectedQuotationInstanceData.clichePrices}
                                            foilPrices={selectedQuotationInstanceData.foilPrices}
                                            totalOfStampings={selectedQuotationInstanceData.totalOfStampings}
                                            productionPrice={selectedQuotationInstanceData.productionPrice}
                                            totalPrice={selectedQuotationInstanceData.totalPrice}
                                            totalCustomPrice={selectedQuotationInstanceData.totalCustomPrice} /> }
        </>
    );
}