import { useState } from "react";
import { ConfigurationScreen } from "./configuration_screen/ConfigurationScreen";
import { useSelector, useDispatch } from 'react-redux';
import { addArt, addArtFragment, addConfiguration } from './actions';
import { createArtFragments } from './helpers';
import './css/app.css';

function App() {
  const [ready, setReady] = useState(false);
  const dispatch = useDispatch();

  const configurations = useSelector(state => state.configurations);
  const arts = useSelector(state => state.arts);

  const onFileChange = async event => {
    dispatch(addConfiguration(1, 'Configuration 1', [...Array(event.target.files.length).keys()].map(n => n + 1)));

    const promises = [];
    for (let i = 0; i < event.target.files.length; i++) {
      promises.push(new Promise(resolve => {
        const file = event.target.files[i];
        const reader = new FileReader();
  
        reader.onload = (e) => {
          const img = new Image();
  
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
  
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = new Uint8Array(imageData.data.buffer);
  
            dispatch(addArt(1, 300, img.height, img.width, e.target.result));
  
            const artFragments = createArtFragments(data, img);
            artFragments.forEach(artFragment => {
              dispatch(addArtFragment(i + 1, artFragment.x, artFragment.y, artFragment.height, artFragment.width, artFragment.data));
            });

            resolve();
          }
  
          img.src = e.target.result;
        }
  
        reader.readAsDataURL(file);
      }));
    }

    await Promise.all(promises);
    setReady(true);
  };

  return (
    <>
      { Object.keys(arts.data).length === 0 && <div id="page-container">
        <section id="import-modal">
          <h1>Hot stamping quotation tool</h1>
          <p>Choose an image file to begin. The image must have a dpi of 300.</p>
          <input type="file" onChange={onFileChange} multiple="multiple" />
        </section>
      </div>}

      { ready && <ConfigurationScreen configuration={configurations.data[1]} /> }
    </>
  );
}

export default App;
