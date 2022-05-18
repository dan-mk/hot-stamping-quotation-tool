import { QuotationInstanceScreen } from './QuotationInstanceScreen';
import { useDispatch, useSelector } from 'react-redux';
import './../../../css/quotation-screen.css';
import { useState } from 'react';
import api from './../../../helpers/api';
import { addQuotationInstance, deleteQuotationInstance } from '../../../redux/actions/configurationActions';

export function OverallQuotationScreen(props) {
    const configuration = props.configuration;
    const onClickClose = props.onClickClose;
    const quotationInstances = props.quotationInstances;

    const quote = configuration.quotation;
    const arts = configuration.quotation.arts;

    const [numberOfPages, setNumberOfPages] = useState({});

    const foilTypes = useSelector(state => state.foil_types.data);
    
    const [showQuotationInstanceScreen, setShowQuotationInstanceScreen] = useState(false);
    const [selectedQuotationInstanceId, setSelectedQuotationInstanceId] = useState(null);

    const onClickCloseInstance = () => {
        setShowQuotationInstanceScreen(false);
    };

    const dispatch = useDispatch();

    const addQuotationInst = () => {
        const isInputValid = Object.values(numberOfPages).every(a => a !== '' && a > 0) 
                                && Object.values(numberOfPages).length === arts.length;
        if (isInputValid) {
            dispatch(addQuotationInstance(numberOfPages, foilTypes));
            setNumberOfPages({});
        }
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
                <div className="overall-quotation-add-row" style={{ marginBottom: '10px' }}>
                    <div></div>
                    { arts.map((art, j) => {

                        const handleChange = (e) => {
                            if (!e.target.validity.valid) {
                                return;
                            }
                            const newValue = e.target.value === '' ? '' : parseInt(e.target.value);
                            setNumberOfPages({ ...numberOfPages, [art.index]: newValue });
                        };

                        return (<div key={j}>
                            <input
                                pattern="[0-9]{0,6}"
                                value={numberOfPages[art.index] ?? ''}
                                onChange={handleChange}
                                className="quotation-input" />
                        </div>);
                    }) }
                    <div>
                        <button className="quotation-button" onClick={addQuotationInst}>Add</button>
                    </div>
                    <div></div>
                </div>
                <div>
                    <div></div>
                    { arts.map((_, i) => <div key={i} className="overall-quotation-header-cell">Number of pages</div>) }
                    <div className="overall-quotation-header-cell">Price</div>
                </div>
                { Object.values(quotationInstances).map((quotationInstance, i) => {
                    

                    const onClickDelete = (quotationInstance) => {
                        dispatch(deleteQuotationInstance(quotationInstance.id));
                    };

                    const onClickCustomize = () => {
                        setSelectedQuotationInstanceId(quotationInstance.id);
                        setShowQuotationInstanceScreen(true);
                    };

                    return (
                        <div key={i} className="overall-quotation-options-row">
                            <div style={{ marginTop: '5px' }}>{ i + 1 }</div>
                            { arts.map((art, j) => {
                                return (<div key={j}>
                                    {quotationInstance.number_of_pages[art.index]}
                                </div>);
                            }) }
                            <div>
                                <span className="overall-quotation-price">
                                    $ { quotationInstance.total.custom }
                                </span>
                                <button 
                                    className="quotation-button"
                                    onClick={onClickCustomize}>
                                    Customize
                                </button>
                                <img src="/times-solid.svg" onClick={() => onClickDelete(quotationInstance)} style={{ width: '12px', cursor: 'pointer' }}/>
                            </div>
                        </div>
                    );
                }) }
                { Object.keys(quotationInstances).length === 0 && <div className="overall-quotation-options-row"> 
                    <div></div>
                    <div>No quotations simulated yet</div>
                </div> }
            </div>
        </div>
        { showQuotationInstanceScreen && <QuotationInstanceScreen
                                            configuration={configuration}
                                            onClickClose={onClickCloseInstance}
                                            quotationInstanceId={selectedQuotationInstanceId}
                                            quotationInstance={quotationInstances[selectedQuotationInstanceId]} /> }
        </>
    );
}