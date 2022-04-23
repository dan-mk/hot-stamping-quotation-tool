import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { ConfigurationScreen } from "./configuration_screen/ConfigurationScreen";
import { addArt, addArtFragment, addConfiguration } from './redux/actions';
import api from './helpers/api';
import './css/app.css';

function Configuration() {
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

        const formData = new FormData();
        formData.append('image', file);

        api.post('/fragment-image', formData).then(res => {
          const { artFragments, width, height } = res.data;

          dispatch(addArt(1, 300, height, width));
          artFragments.forEach(artFragment => {
            dispatch(addArtFragment(i + 1, artFragment.x, artFragment.y, artFragment.height, artFragment.width, artFragment.data));
          });

          resolve();
        });
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

export default Configuration;
