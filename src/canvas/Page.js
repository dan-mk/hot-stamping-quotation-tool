import "./Page.css";
import { Cluster } from "./Cluster";
import { Cliche } from "./Cliche";

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
                props.cliches.map((cliche, i) => {
                    let clicheResource = props.resources.cliches.find(c => c.id === cliche.id);
                    return <Cliche
                                height={clicheResource.height}
                                width={clicheResource.width}
                                xOffset={cliche.xOffset}
                                yOffset={cliche.yOffset}
                                key={i} />
                })
            }
            {
                props.clusters.map((cluster, i) => {
                    return <Cluster 
                                highlighted={cluster.highlighted}
                                selected={cluster.selected}
                                attachedCliche={cluster.attachedCliche}
                                artFragments={cluster.artFragments}
                                index={i}
                                key={i} />
                })
            }
        </div>
    );
}