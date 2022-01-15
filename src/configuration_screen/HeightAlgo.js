import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getArtFragments } from "../helpers";

export function HeightAlgo(props) {
    const art = props.art;

    const refContainer = useRef(null);
    const refContainerFinal = useRef(null);
    const artFragments = useSelector(state => getArtFragments(state, art));

    const update = () => {
        if (artFragments.length < 6) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const minX = artFragments.reduce((min, artFragment) => Math.min(min, artFragment.x), art.width);
        const maxX = artFragments.reduce((max, artFragment) => Math.max(max, artFragment.x + artFragment.width - 1), 0);

        const minY = artFragments.reduce((min, artFragment) => Math.min(min, artFragment.y), art.height);
        const maxY = artFragments.reduce((max, artFragment) => Math.max(max, artFragment.y + artFragment.height - 1), 0);

        const height = maxY - minY + 1;
        const width = maxX - minX + 1;

        canvas.style.width = '100%';
        canvas.style.display = 'block';
        canvas.height = height;
        canvas.width = width;

        ctx.fillStyle = "rgba(" + 0 + "," + 0 + "," + 0 + "," + 1 + ")";
        for (let artFragment of artFragments) {
            for (let i = 0; i < artFragment.data.length; i++) {
                for (let j = 0; j < artFragment.data[0].length; j++) {
                    if (artFragment.data[i][j] === 1) {
                        ctx.fillRect(artFragment.x - minX + j, artFragment.y - minY + i, 1, 1);
                    }
                }
            }
        }

        refContainer.current.innerHTML = '';
        refContainer.current.style.height = height;
        refContainer.current.style.width = width;
        refContainer.current.appendChild(canvas);

        const canvasFinal = document.createElement('canvas');
        const ctxFinal = canvasFinal.getContext('2d');

        canvasFinal.style.width = '100%';
        canvasFinal.style.display = 'block';
        canvasFinal.height = 2 * height;
        canvasFinal.width = width;

        ctxFinal.drawImage(canvas, 0, height);

        refContainerFinal.current.innerHTML = '';
        refContainerFinal.current.style.height = 2 * height;
        refContainerFinal.current.style.width = width;
        refContainerFinal.current.appendChild(canvasFinal);

        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

        // let maxUp = 0;
        // for (let col = 0; col < canvas.width; col += 1) {
        //     let firstRow = 0;
        //     for (let row = 0; row < canvas.height; row += 1) {
        //         if (imageData.data[4 * (canvas.width * row + col) + 3] !== 0) {
        //             firstRow = row;
        //             break;
        //         }
        //     }
        //     let lastRow = 0;
        //     for (let row = canvas.height - 1; row >= 0; row -= 1) {
        //         if (imageData.data[4 * (canvas.width * row + col) + 3] !== 0) {
        //             lastRow = row;
        //             break;
        //         }
        //     }
        //     maxUp = Math.max(maxUp, lastRow - firstRow + 1);
        // }

        // console.log(maxUp);

        let maxUp = artFragments.reduce((max, artFragment) => Math.max(max, artFragment.height), 0);

        let upTotal = 0;
        let ups = [];

        let up = 0;
        for (let i = 0; i < 20 && upTotal < maxUp; i++) {
            let ok = false;
            up = 0;

            const imageDataFinal = ctxFinal.getImageData(0, 0, ctxFinal.canvas.width, ctxFinal.canvas.height);

            while (!ok) {
                up += 10;

                let conflict = false;
                for (let i = 0; i < imageData.data.length && conflict === false; i += 4) {
                    const alpha = imageData.data[i + 3];
                    if (alpha === 0) continue;
                    const base = 4 * canvas.width * canvas.height;
                    const back = 4 * ctxFinal.canvas.width * up;
                    if (base - back + i + 3 >= 0 && imageDataFinal.data[base - back + i + 3] !== 0) {
                        conflict = true;
                    }
                }                

                ok = !conflict;
            }

            ups.push(up);
            upTotal += up;

            ctxFinal.clearRect(0, 0, canvasFinal.width, canvasFinal.height);
            ctxFinal.putImageData(imageDataFinal, 0, up);
            ctxFinal.drawImage(canvas, 0, canvas.height);
        }

        console.log(ups);
    };

    useEffect(update, [artFragments]);

    return (
        <div style={{background: 'black', minHeight: '100%', minWidth: '100%', position: 'absolute', padding: '20px'}}>
            <div ref={refContainer} style={{width: '400px', height: 'auto', background: 'white'}}></div>

            <div ref={refContainerFinal} style={{width: '400px', height: 'auto', background: 'white', marginTop: '10px'}}></div>
        </div>
    );
}