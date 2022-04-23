import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getArtFragmentsByStep, pixelsToCm } from "../helpers";
import { setStepFoilUse } from '../redux/actions';

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

    const calculateFoilUse = async () => {
        
        console.log(JSON.stringify(artFragments));
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