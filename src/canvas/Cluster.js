import { ArtFragment } from "./ArtFragment";

export function Cluster(props) {
    return (
        <>{
            props.artFragments.map((artFragment, i) => {
                return <ArtFragment
                            key={i}
                            selected={props.selected}
                            height={artFragment.height}
                            width={artFragment.width}
                            xOffset={artFragment.xOffset}
                            yOffset={artFragment.yOffset} />
            }) 
        }</>
    );
}