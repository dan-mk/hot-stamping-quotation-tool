export function FoilOverlay(props) {
    const position = props.position;
    const size = props.size;
    const zoomMultiplier = props.zoomMultiplier;
    const color = props.color;

    let style = {
        background: `${color}33`,
        borderLeft: '2px dashed #00000030',
        borderRight: '2px dashed #00000030',
        position: 'absolute',
        left: zoomMultiplier * (position.x) + 'px',
        top: zoomMultiplier * (position.y) + 'px',
        height: zoomMultiplier * size.height,
        width: zoomMultiplier * size.width,
    };

    return (
        <>
            <div style={style}></div>
        </>
    );
}