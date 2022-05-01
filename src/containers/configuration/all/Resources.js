import { useSelector } from 'react-redux';
import { getAllUniqueCliches, getAllFoils, pixelsToCm } from './../../../helpers';
import './../../../css/resources.css';

export function Resources(props) {
    const configuration = props.configuration;
    const cliches = getAllUniqueCliches(configuration);
    const foils = getAllFoils(configuration);

    const foilTypes = useSelector(state => state.foil_types.data);

    return (
        <div id="resources-subcontainer">
            <header id="resources-header">
                <h1>Resources</h1>
            </header>
            <ul id="resources-content">
                { cliches.length === 0 && foils.length === 0 && <p>No resource created so far</p> }
                { cliches.map(cliche => {
                    let multiplier = (cliche.width > cliche.height ? 40 / cliche.width : 40 / cliche.height );

                    return <li key={'cliche:' + cliche.group_id}>
                        <div className="cliche-icon">
                            <div style={{ width: multiplier * cliche.width, height: multiplier * cliche.height }}></div>
                        </div>
                        <div>
                            Cliche {cliche.group_id}<br/>
                            <small>{ pixelsToCm(cliche.width) + ' x ' + pixelsToCm(cliche.height) } cm</small>
                        </div>
                    </li>
                }) }
                { foils.map(foil => (
                    <li key={'foil:' + foil.id}>
                        <div className="foil-icon" style={{ background: foilTypes[foil.foil_type_id].color }}>
                            <div></div>
                        </div>
                        <div>
                            Foil {foil.id}<br/>
                            <small>{ pixelsToCm(foil.width) } cm</small>
                        </div>
                    </li>
                )) }
            </ul>
        </div>
    );
}