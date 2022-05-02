import { useEffect, useRef, useState } from "react";
import api from '../../../helpers/api';

export function ArtFragment(props) {
    const position = props.position;
    const size = props.size;
    const zoomMultiplier = props.zoomMultiplier;
    const selected = props.selected;
    const hasEverythingCurrentStep = props.hasEverythingCurrentStep;
    const hasEverythingOtherStep = props.hasEverythingOtherStep;
    const hasAnythingOtherStep = props.hasAnythingOtherStep;
    const id = props.id;

    const refContainer = useRef(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.style = 'width: 100%; height: 100%; position: absolute';
        canvas.height = size.height;
        canvas.width = size.width;

        const image = new Image();
        image.src = `${api.defaults.baseURL}/uploads/art_fragments/${id}.png`
        image.onload = () => {
            ctx.drawImage(image, 0, 0);
            setLoaded(true);
        };

        refContainer.current.innerHTML = '';
        refContainer.current.appendChild(canvas);
    }, []);

    useEffect(() => {
        if (!loaded) return;

        const canvas = refContainer.current.querySelector('canvas');
        const ctx = canvas.getContext('2d');

        let color = [220, 0, 0];
        if (selected) {
            color = [237, 111, 0];
        } else if (hasEverythingCurrentStep) {
            color = [30, 30, 255];
        } else if (hasEverythingOtherStep) {
            color = [161, 161, 255];
        } else if (hasAnythingOtherStep) {
            color = [255, 161, 161];
        }

        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + 1 + ")";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, [selected, hasEverythingCurrentStep, hasEverythingOtherStep, hasAnythingOtherStep, loaded]);

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