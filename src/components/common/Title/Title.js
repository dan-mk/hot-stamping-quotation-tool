import Style from "./Style";

function Title(props) {
    return (
        <div style={Style.container}>
            <h1 style={Style.title}>{props.children}</h1>
        </div>
    );
}

export default Title;
