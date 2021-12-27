import '../css/toolbar.css';

export function Toolbar(props) {
    const onClickSelectArtFragments = props.onClickSelectArtFragments;
    const onClickSelectCliches = props.onClickSelectCliches;
    const onClickNewCliche = props.onClickNewCliche;
    const onClickNewFoil = props.onClickNewFoil;
    const selectionType = props.selectionType;

    return (
        <div id="toolbar-subcontainer">
            <div
                className={(selectionType === 'art_fragments' ? 'selected ' : '') + "toolbar-option"}
                onClick={onClickSelectArtFragments}>
                    SF
            </div>
            <div
                className={(selectionType === 'cliches' ? 'selected ' : '') + "toolbar-option"}
                onClick={onClickSelectCliches}>
                    SC
            </div>
            <div className="toolbar-option" onClick={onClickNewCliche}>NC</div>
            <div className="toolbar-option" onClick={onClickNewFoil}>NF</div>
        </div>
    );
}