export function SelectionBox(props) {
    const selectionStartPosition = props.selectionStartPosition;
    const mousePosition = props.mousePosition;

    const left = Math.min(selectionStartPosition.x, mousePosition.x);
    const top = Math.min(selectionStartPosition.y, mousePosition.y);
    const width = Math.abs(selectionStartPosition.x - mousePosition.x);
    const height = Math.abs(selectionStartPosition.y - mousePosition.y);

    const style = {
        border: '2px dotted #00d900',
        boxSizing: 'border-box',
        position: 'absolute',
        left: left,
        top: top,
        height: height,
        width: width,
        margin: '-1px 0 0 -1px',
    };

    return (
        <div style={style}></div>
    );
}