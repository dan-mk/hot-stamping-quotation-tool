export function Paper(props) {
    const size = props.size;
    const focusPoint = props.focusPoint;
    const zoomMultiplier = props.zoomMultiplier;

    let stylePaper = {
        background: 'white',
        position: 'absolute',
        left: -zoomMultiplier * (focusPoint.x + size.width / 2) + 'px',
        top: -zoomMultiplier * (focusPoint.y + size.height / 2) + 'px',
        height: zoomMultiplier * size.height,
        width: zoomMultiplier * size.width,
    };

    return (
        <div style={stylePaper}></div>
    );
}