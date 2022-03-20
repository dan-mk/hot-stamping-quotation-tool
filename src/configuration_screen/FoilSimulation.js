import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cmToPixels, getArtFragmentsByStep, pixelsToCm } from "../helpers";
import { setStepFoilUse } from '../actions';

export function FoilSimulation(props) {
    const configuration = props.configuration;
    const art = props.art;
    const currentStep = props.currentStep;
    const setShowFoilSimulation = props.setShowFoilSimulation;

    const refContainer = useRef(null);
    const artFragments = useSelector(state => getArtFragmentsByStep(state, configuration, art, currentStep));

    const [mainCanvas, setMainCanvas] = useState(null);
    const [displayCanvas, setDisplayCanvas] = useState(null);
    const [foilUse, setFoilUse] = useState([]);

    const dispatch = useDispatch();

    const calculateFoilUse = () => {
        const margin = cmToPixels(0.5);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const mainCanvas = document.createElement('canvas');
        const mainCtx = mainCanvas.getContext('2d');

        const minX = artFragments.reduce((min, artFragment) => Math.min(min, artFragment.x), art.width);
        const maxX = artFragments.reduce((max, artFragment) => Math.max(max, artFragment.x + artFragment.width - 1), 0);

        const minY = artFragments.reduce((min, artFragment) => Math.min(min, artFragment.y), art.height);
        const maxY = artFragments.reduce((max, artFragment) => Math.max(max, artFragment.y + artFragment.height - 1), 0);

        const height = maxY - minY + 1 + margin;
        const width = maxX - minX + 1 + margin;

        canvas.style.width = '100%';
        canvas.style.display = 'block';
        canvas.height = height;
        canvas.width = width;

        mainCanvas.style.width = '100%';
        mainCanvas.style.display = 'block';
        mainCanvas.height = height;
        mainCanvas.width = width;

        ctx.fillStyle = "rgba(" + 0 + "," + 0 + "," + 0 + "," + 1 + ")";
        for (let artFragment of artFragments) {
            for (let i = 0; i < artFragment.data.length; i++) {
                for (let j = 0; j < artFragment.data[0].length; j++) {
                    if (artFragment.data[i][j] === 1) {
                        ctx.fillRect(artFragment.x - minX + j, artFragment.y - minY + i, margin, margin);
                        mainCtx.fillRect(artFragment.x - minX + j + margin, artFragment.y - minY + i + margin, 1, 1);
                    }
                }
            }
        }

        setMainCanvas(mainCanvas);

        const canvasFinal = document.createElement('canvas');
        const ctxFinal = canvasFinal.getContext('2d');

        canvasFinal.style.width = '100%';
        canvasFinal.style.display = 'block';
        canvasFinal.height = 2 * height;
        canvasFinal.width = width;

        ctxFinal.drawImage(canvas, 0, height);

        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

        let maxUp = 0;
        for (let col = 0; col < canvas.width; col += 1) {
            let firstRow = 0;
            for (let row = 0; row < canvas.height; row += 1) {
                if (imageData.data[4 * (canvas.width * row + col) + 3] !== 0) {
                    firstRow = row;
                    break;
                }
            }
            let lastRow = 0;
            for (let row = canvas.height - 1; row >= 0; row -= 1) {
                if (imageData.data[4 * (canvas.width * row + col) + 3] !== 0) {
                    lastRow = row;
                    break;
                }
            }
            maxUp = Math.max(maxUp, lastRow - firstRow + 1);
        }

        let maxUpTotal = artFragments.reduce((max, artFragment) => Math.max(max, artFragment.height), 0);

        let upTotal = 0;
        let ups = [];

        let up = 0;
        for (let i = 0; i < 20 && upTotal < maxUpTotal && up < maxUp; i++) {
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

        setFoilUse(ups);
        dispatch(setStepFoilUse(configuration.id, art.id, currentStep, ups));
    };

    const createFinalImage = () => {
        if (foilUse.length === 0) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.style.display = 'block';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
        canvas.style.position = 'absolute';
        canvas.style.objectFit = 'contain';
        canvas.height = mainCanvas.height + foilUse.reduce((sum, n) => sum + n, 0);
        canvas.width = mainCanvas.width;

        const reversedFoilUse = [...foilUse];
        reversedFoilUse.reverse();

        ctx.globalAlpha = 0.4;
        ctx.drawImage(mainCanvas, 0, 0);
        let sum = 0;
        reversedFoilUse.forEach((n, i) => {
            sum += n;
            ctx.globalAlpha = 0.4 + ((i + 1) * 0.6 / foilUse.length);
            ctx.drawImage(mainCanvas, 0, sum);
        });

        refContainer.current.innerHTML = '';
        refContainer.current.appendChild(canvas);

        setDisplayCanvas(canvas);
    };

    const setLevels = () => {
        if (displayCanvas === null) return;

        let resizeFactor = Math.min(
            displayCanvas.clientHeight / displayCanvas.height,
            displayCanvas.clientWidth / displayCanvas.width,
        );

        const base = (displayCanvas.clientHeight - (resizeFactor * displayCanvas.height)) / 2;
        const baseLeft = (displayCanvas.clientWidth - (resizeFactor * displayCanvas.width)) / 2;
        
        let verticalLine = document.createElement('div');
        verticalLine.style.position = 'absolute';
        verticalLine.style.height = parseInt(resizeFactor * foilUse.reduce((sum, n) => sum + n, 0)) + 2 + 'px';
        verticalLine.style.borderRight = '2px solid black';
        verticalLine.style.bottom = base + 'px';
        verticalLine.style.left = `${baseLeft - 21}px`;
        refContainer.current.appendChild(verticalLine);

        let sum = 0;
        [0, ...foilUse].forEach((n, i) => {
            sum += n;

            let levelLine = document.createElement('div');
            levelLine.style.position = 'absolute';
            levelLine.style.width = 36 + parseInt(resizeFactor * displayCanvas.width) + 'px';
            levelLine.style.borderBottom = '2px dashed #FF000099';
            levelLine.style.bottom = base + parseInt(resizeFactor * sum) + 'px';
            levelLine.style.right = `${baseLeft - 5}px`;
            refContainer.current.appendChild(levelLine);

            if (i > 0) {
                let level = document.createElement('div');
                level.innerHTML = pixelsToCm(n) + ' cm';
                level.style.position = 'absolute';
                level.style.whiteSpace = 'nowrap';
                level.style.bottom = base + parseInt(resizeFactor * (sum - n + 0.5 * n) - 7) + 'px';
                level.style.right = `calc(100% + ${40 - baseLeft}px)`;
                refContainer.current.appendChild(level);
            }
        });

        const closeButton = document.createElement('img');
        closeButton.setAttribute('src', 'times-solid.svg');
        closeButton.style.width = '18px';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '-10px';
        closeButton.style.right = '-120px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.zIndex = '1';
        closeButton.onclick = () => setShowFoilSimulation(false);

        refContainer.current.appendChild(closeButton);
    };

    useEffect(calculateFoilUse, []);
    useEffect(createFinalImage, [foilUse]);
    useEffect(setLevels, [displayCanvas]);

    return (
        <div style={{background: 'white', minHeight: '100%', minWidth: '100%', position: 'absolute'}}>
            <div ref={refContainer} style={{
                background: 'white', position: 'absolute', height: 'calc(100% - 60px)', width: 'calc(100% - 280px)',
                left: '140px', top: '30px'
            }}></div>
        </div>
    );
}