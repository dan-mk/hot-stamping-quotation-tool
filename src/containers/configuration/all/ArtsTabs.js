import './../../../css/art-tabs.css';

export function ArtsTabs(props) {
    const configuration = props.configuration;
    const onClickTab = props.onClickTab;
    const currentArt = props.currentArt;
    const arts = configuration.quotation.arts;

    return (
        <ul id="arts-nav">
            { arts.map((art, i) => {
                return <li
                    className={currentArt === i + 1 ? 'selected-art' : ''}
                    onClick={() => onClickTab(i + 1)}
                    key={i}>
                        Art {i + 1}
                </li>;
            })}
        </ul>
    );
}