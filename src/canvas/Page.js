import "./Page.css";
import { Cluster } from "./Cluster";

export function Page(props) {
    let style = {
        height: props.height + 'px',
        width: props.width + 'px',
        left: props.xOffset + 'px',
        top: props.yOffset + 'px',
    };

    return (
        <div className="Page" style={style}>
            {
                props.clusters.map((cluster, i) => {
                    return <Cluster 
                                highlighted={cluster.highlighted}
                                selected={cluster.selected}
                                artFragments={cluster.artFragments}
                                index={i}
                                key={i} />
                })
            }
        </div>
    );
}