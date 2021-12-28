import '../css/resources.css';

export function Resources(props) {
    const configuration = props.configuration;
    const cliches = Object.values(configuration.arts).reduce((list, art) => {
        return [...list, ...Object.values(art.steps).reduce((list2, step) => {
            return [...list2, ...Object.values(step.cliches.data)];
        }, [])];
    }, []);
    const foils = Object.values(configuration.arts).reduce((list, art) => {
        return [...list, ...Object.values(art.steps).reduce((list2, step) => {
            return [...list2, ...Object.values(step.foils.data)];
        }, [])];
    }, []);

    return (
        <div id="resources-subcontainer">
            <header id="resources-header">
                <h1>Resources</h1>
            </header>
            <ul id="resources-content">
                { cliches.length === 0 && foils.length === 0 && <p>No resource created so far</p> }
                { cliches.map(cliche => (
                    <li key={'cliche:' + cliche.group_id}>
                        Cliche {cliche.group_id}
                    </li>
                )) }
                { foils.map(foil => (
                    <li key={'foil:' + foil.id}>
                        Foil {foil.id}
                    </li>
                )) }
            </ul>
        </div>
    );
}