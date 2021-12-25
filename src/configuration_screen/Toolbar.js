
export function Toolbar(props) {
    const onClickSelectArtFragments = props.onClickSelectArtFragments;
    const onClickSelectCliches = props.onClickSelectCliches;
    const onClickNewCliche = props.onClickNewCliche;
    const onClickNewFoil = props.onClickNewFoil;

    return (
        <>
            <div onClick={onClickSelectArtFragments}>Select art fragments</div>
            <div onClick={onClickSelectCliches}>Select cliches</div>
            <div onClick={onClickNewCliche}>New Cliche</div>
            <div onClick={onClickNewFoil}>New Foil</div>
        </>
    );
}