export function ArtFragment(props) {
    const position = props.position;
    const size = props.size;
    const zoomMultiplier = props.zoomMultiplier;
    const selected = props.selected;
    const usedAllSteps = props.usedAllSteps;
    const used = props.used;

    let style = {
        background: used ? 'white' : (usedAllSteps ? 'blue' : (selected ? 'orange' : 'red')),
        position: 'absolute',
        left: zoomMultiplier * (position.x) + 'px',
        top: zoomMultiplier * (position.y) + 'px',
        height: zoomMultiplier * size.height,
        width: zoomMultiplier * size.width,
    };

    return (
        <div style={style}></div>
    );
}