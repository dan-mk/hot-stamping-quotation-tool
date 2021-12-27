export function Cliche(props) {
    const position = props.position;
    const size = props.size;
    const zoomMultiplier = props.zoomMultiplier;
    const selected = props.selected;
    const used = props.used;

    let style = {
        background: used ? '#999' : (selected ? 'rgb(255, 127, 0)' : '#ed0000'),
        border: '3px dashed black',
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