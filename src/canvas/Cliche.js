import "./Cliche.css";

export function Cliche(props) {
    let style = {
        height: props.height,
        width: props.width,
        left: props.xOffset,
        top: props.yOffset,
    };

    return <div className="Cliche" style={style}></div>;
}