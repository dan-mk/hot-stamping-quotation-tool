import "./Page.css";

export function Page(props) {
    let style = {
        height: props.mmHeight + 'px',
        width: props.mmWidth + 'px',
        top: props.mmVerticalOffset + 'px',
        left: props.mmHorizontalOffset + 'px',
    };

    return <div className="Page" style={style}></div>;
}