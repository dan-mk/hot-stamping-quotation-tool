import { getConfigurationArts } from '../helpers';
import { QuotationInstanceScreen } from './QuotationInstanceScreen';
import { useSelector } from 'react-redux';
import '../css/quotation-screen.css';
import { useState } from 'react';

export function OverallQuotationScreen(props) {
    const configuration = props.configuration;
    const onClickClose = props.onClickClose;
    const quotationInstances = props.quotationInstances;
    const setQuotationInstances = props.setQuotationInstances;
    const addQuotationInstance = props.addQuotationInstance;
    const quoteId = configuration.quote_id;

    const quote = useSelector(state => state.quotes.data[quoteId]);
    const arts = useSelector(state => getConfigurationArts(state, configuration));
    
    const [showQuotationInstanceScreen, setShowQuotationInstanceScreen] = useState(false);
    const [selectedQuotationInstance, setSelectedQuotationInstance] = useState(null);

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
                <img onClick={onClickClose} src="times-solid.svg"/>
            </header>
            <div id="overall-quotation-content-container">
                <div>
                    <div></div>
                    { arts.map(art => {
                        return <div className="overall-quotation-image-cell">
                            <img src={art.base64} />
                        </div>
                    }) }
                    <div></div>
                </div>
                <div>
                    <div></div>
                    { arts.map(art => <div className="overall-quotation-title-cell">Art {art.id}</div>) }
                    <div></div>
                </div>
                <div>
                    <div></div>
                    { arts.map(() => <div className="overall-quotation-header-cell">Number of pages</div>) }
                    <div className="overall-quotation-header-cell">Price</div>
                </div>
                { Object.values(quotationInstances.data).map((quotationInstance, i) => {
                    const areAllValuesFilled = arts.reduce((arePreviousValuesFilled, art) => {
                        return arePreviousValuesFilled && quotationInstance.number_of_pages[art.id];
                    }, true);

                    let price = 0;
                    if (areAllValuesFilled) {
                        price = arts.reduce((sum, art) => {
                            return sum + quotationInstance.number_of_pages[art.id];
                        }, 0);
                    }

                    const onClickDelete = () => {
                        setQuotationInstances(draft => {
                            delete draft.data[quotationInstance.id];
                        });
                    };

                    const onClickCustomize = () => {
                        setSelectedQuotationInstance(quotationInstances.data[quotationInstance.id]);
                        setShowQuotationInstanceScreen(true);
                    };

                    return (
                        <div className="overall-quotation-options-row">
                            <div>{ i + 1 }</div>
                            { arts.map(art => {
                                const handleChange = (e) => {
                                    setQuotationInstances(draft => {
                                        const number_of_pages = draft.data[quotationInstance.id].number_of_pages;
                                        const newValue = e.target.validity.valid ? e.target.value : number_of_pages[art.id];
                                        number_of_pages[art.id] = newValue === '' ? '' : parseInt(newValue);
                                    });
                                };

                                return (<div>
                                    <input
                                        pattern="[0-9]{0,6}"
                                        value={quotationInstance.number_of_pages[art.id]}
                                        onChange={handleChange}
                                        className="quotation-input" />
                                </div>);
                            }) }
                            <div>
                                <span class="overall-quotation-price">
                                    $ { areAllValuesFilled ? price.toFixed(2) : '---' }
                                </span>
                                <button 
                                    className={"quotation-button" + (areAllValuesFilled ? "" : " quotation-button-disabled")}
                                    onClick={onClickCustomize}>
                                    Customize
                                </button>
                                { Object.values(quotationInstances.data).length > 1 &&
                                    <img src="times-solid.svg" onClick={onClickDelete} style={{ width: '12px', cursor: 'pointer' }}/> }
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
                                            quotationInstance={selectedQuotationInstance}
                                                                /> }
        </>
    );
}