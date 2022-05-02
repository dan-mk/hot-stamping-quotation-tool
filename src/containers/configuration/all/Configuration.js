import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import api from '../../../helpers/api';
import { ConfigurationScreen } from "./ConfigurationScreen";
import { setSelectedConfiguration } from "../../../redux/actions/configurationActions";
import './../../../css/app.css';

function Configuration() {
  const { configurationId } = useParams();
  const dispatch = useDispatch();

  const configuration = useSelector(state => state.configurations.selected);
  // const arts = useSelector(state => state.arts);

  const fetchConfiguration = async () => {
    if (configuration) {
        return;
    }
    try {
        const response = await api.get(`/configurations/${configurationId}`);
        dispatch(setSelectedConfiguration(response.data));
    } catch (e) {
        console.log(e);
    }
  };

  useEffect(() => {
    fetchConfiguration();
    return () => {
        dispatch(setSelectedConfiguration(null));
    };
  }, []);

  return (
    <>
      { configuration && <ConfigurationScreen configuration={configuration} /> }
    </>
  );
}

export default Configuration;
