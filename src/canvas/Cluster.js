import { ArtFragment } from "./ArtFragment";

export function Cluster(props) {
    return (
        <>{
            props.artFragments.map((artFragment, i) => {
                return <ArtFragment
                            key={i}
                            highlighted={props.highlighted}
                            selected={props.selected}
                            attachedCliche={props.attachedCliche}
                            height={artFragment.height}
                            width={artFragment.width}
                            xOffset={artFragment.xOffset}
                            yOffset={artFragment.yOffset} />
            }) 
        }</>
    );
}