import { getConfigurationArts } from '../helpers';
import { useSelector } from 'react-redux';
import '../css/quotation-instance-screen.css';
import { Workspace } from './Workspace';

export function QuotationInstanceScreen(props) {
    const configuration = props.configuration;
    const onClickClose = props.onClickClose;
    const quotationInstance = props.quotationInstance;
    const quoteId = configuration.quote_id;
    
    const quote = useSelector(state => state.quotes.data[quoteId]);
    const arts = useSelector(state => getConfigurationArts(state, configuration));

    return (
        <div id="quotation-instance-container">
            <header>
                <div style={{ flexGrow: '1' }}>
                    <p>{ quote.description }</p>
                    <h1>{ configuration.description }</h1>
                </div>
                <img onClick={onClickClose} src="times-solid.svg"/>
            </header>
            <div id="quotation-instance-content-container">
                <div id="quotation-instance-arts-container">
                    { arts.map(art => {
                        return (
                            <>
                                <div className="quotation-instance-image-cell">
                                    <img src={art.base64} />
                                </div>
                                <div className="quotation-instance-art-details-cell">
                                    <div>
                                        <p>Art {art.id}</p>
                                        <span>{quotationInstance.number_of_pages[art.id]} pages</span>
                                    </div>
                                </div>
                            </>
                        );
                    }) }
                </div>
                <div id="quotation-instance-resources">
                    <h1>Resources</h1>
                    {
                        Object.values(configuration.arts).map((art, i) => {
                            return Object.values(art.steps).map((step, j) => {
                                return (
                                    <div key={i + '-' + j} class="quotation-instance-step-container">
                                        <div class="quotation-instance-step-image">
                                            <Workspace 
                                                show={true}
                                                key={j}
                                                art={arts.find(a => a.id === art.id)}
                                                configuration={configuration}
                                                showOnlyPaper={true}
                                                step={step.id}
                                                paddingHorizontal={8}
                                                paddingVertical={32}
                                                zoomBase={1.02} />
                                        </div>
                                        <div class="quotation-instance-step-description">
                                            <h1>Art { art.id }, step { step.id }</h1>
                                            <h2>Cliches</h2>
                                            <div class="quotation-instance-step-price-table">
                                                <div class="quotation-instance-step-price-table-header">
                                                    <div>Name</div>
                                                    <div>Regular price</div>
                                                    <div>Custom price</div>
                                                </div>
                                                {
                                                    Object.values(step.cliches.data).map(cliche => {
                                                        return (
                                                            <div class="quotation-instance-step-price-table-row">
                                                                <div>Cliche { cliche.group_id }</div>
                                                                <div>$ 0.00</div>
                                                                <div><input className='quotation-input' /></div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                            <h2>Foils</h2>
                                            <div class="quotation-instance-step-price-table">
                                                <div class="quotation-instance-step-price-table-header">
                                                    <div>Name</div>
                                                    <div>Regular price</div>
                                                    <div>Custom price</div>
                                                </div>
                                                {
                                                    Object.values(step.foils.data).map(foil => {
                                                        return (
                                                            <div class="quotation-instance-step-price-table-row">
                                                                <div>Foil { foil.id }</div>
                                                                <div>$ 0.00</div>
                                                                <div><input className='quotation-input' /></div>
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
                                        <div class="quotation-instance-production-step">
                                            <p>Art { art.id }, step { step.id }</p>
                                            <span>{ quotationInstance.number_of_pages[art.id] } stampings</span>
                                        </div>
                                    );
                                });
                            })
                        }
                    </div>
                    <div className='quotation-instance-production-price-container'>
                        <div>
                            <div>Total of stampings</div>
                            <div>Regular price</div>
                            <div>Custom price</div>
                        </div>
                        <div>
                            <div>
                                { Object.values(quotationInstance.number_of_pages).reduce((sum, n) => sum + n, 0) }
                            </div>
                            <div>$ 0.00</div>
                            <div><input className='quotation-input' /></div>
                        </div>
                    </div>
                </div>
                <footer id="final-price-container">
                    Final price: $ 0.00
                </footer>
            </div>
        </div>
    );
}