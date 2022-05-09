import './../../../css/quotation-instance-screen.css';
import { Workspace } from './Workspace';
import api from './../../../helpers/api';

export function QuotationInstanceScreen(props) {
    const configuration = props.configuration;
    const onClickClose = props.onClickClose;
    const quotationInstance = props.quotationInstance;
    const setQuotationInstances = props.setQuotationInstances;
    const clichePrices = props.clichePrices;
    const foilPrices = props.foilPrices;
    const totalOfStampings = props.totalOfStampings;
    const productionPrice = props.productionPrice;
    const totalPrice = props.totalPrice;
    const totalCustomPrice = props.totalCustomPrice;
    
    const quote = configuration.quotation;
    const arts = configuration.quotation.arts;

    const handleChangeProduction = (e) => {
        setQuotationInstances(draft => {
            const production_price = draft.data[quotationInstance.id].production_price;
            const newValue = e.target.validity.valid ? e.target.value : production_price;
            draft.data[quotationInstance.id].production_price = newValue;
        });
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
                                                zoomBase={1.02} />
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
                                                            setQuotationInstances(draft => {
                                                                const cliche_price = draft.data[quotationInstance.id].cliche_price;
                                                                const newValue = e.target.validity.valid ? e.target.value : cliche_price[cliche.id];
                                                                cliche_price[cliche.id] = newValue;
                                                            });
                                                        };
                                                        return (
                                                            <div className="quotation-instance-step-price-table-row" key={cliche.id}>
                                                                <div>Cliche { cliche.group_id }</div>
                                                                <div>$ { clichePrices[cliche.id] }</div>
                                                                <div>
                                                                    <input
                                                                        pattern="[0-9]{0,6}(\.[0-9]{0,2})?"
                                                                        className='quotation-input'
                                                                        value={quotationInstance.cliche_price[cliche.id]}
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
                                                            setQuotationInstances(draft => {
                                                                const foil_price = draft.data[quotationInstance.id].foil_price;
                                                                const newValue = e.target.validity.valid ? e.target.value : foil_price[foil.id];
                                                                foil_price[foil.id] = newValue;
                                                            });
                                                        };
                                                        return (
                                                            <div className="quotation-instance-step-price-table-row" key={foil.id}>
                                                                <div>Foil { foil.id }</div>
                                                                <div>$ { foilPrices[foil.id] }</div>
                                                                <div>
                                                                    <input
                                                                        pattern="[0-9]{0,6}(\.[0-9]{0,2})?"
                                                                        className='quotation-input'
                                                                        value={quotationInstance.foil_price[foil.id]}
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
                                { totalOfStampings }
                            </div>
                            <div>$ { productionPrice.toFixed(2) }</div>
                            <div>
                                <input
                                    pattern="[0-9]{0,6}(\.[0-9]{0,2})?"
                                    className='quotation-input'
                                    value={quotationInstance.production_price}
                                    onChange={handleChangeProduction} />
                                </div>
                        </div>
                    </div>
                </div>
                <footer id="final-price-container">
                    <small>Final regular price: $ { totalPrice.toFixed(2) }</small><br />
                    Final custom price: $ { totalCustomPrice.toFixed(2) }
                </footer>
            </div>
        </div>
    );
}