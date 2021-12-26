import { useEffect, useRef } from "react";

export function ArtFragment(props) {
    const position = props.position;
    const size = props.size;
    const zoomMultiplier = props.zoomMultiplier;
    const selected = props.selected;
    const usedAllSteps = props.usedAllSteps;
    const used = props.used;
    const data = props.data;

    const refContainer = useRef(null);

    useEffect(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.style = 'width: 100%; height: 100%; position: absolute';
        canvas.height = size.height;
        canvas.width = size.width;

        ctx.fillStyle = "rgba(" + 0 + "," + 0 + "," + 0 + "," + 1 + ")";
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[0].length; j++) {
                if (data[i][j] === 1) {
                    ctx.fillRect(j, i, 1, 1);
                }
            }
        }

        refContainer.current.innerHTML = '';
        refContainer.current.appendChild(canvas);
    }, []);

    useEffect(() => {
        const canvas = refContainer.current.querySelector('canvas');
        const ctx = canvas.getContext('2d');

        let color = [255, 0, 0];
        if (used) {
            color = [255, 255, 255];
        } else if (usedAllSteps) {
            color = [0, 0, 255];
        } else if (selected) {
            color = [255, 127, 0];
        }

        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + 1 + ")";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, [used, usedAllSteps, selected]);

    let style = {
        position: 'absolute',
        left: zoomMultiplier * (position.x) + 'px',
        top: zoomMultiplier * (position.y) + 'px',
        height: zoomMultiplier * size.height,
        width: zoomMultiplier * size.width,
    };

    return (
        <div style={style} ref={refContainer}></div>
    );
}