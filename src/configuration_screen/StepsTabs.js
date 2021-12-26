import { useDispatch } from 'react-redux';
import { addStep } from '../actions';

export function StepsTabs(props) {
    const configuration = props.configuration;
    const art = props.art;
    const steps = Object.values(configuration.arts[art.id].steps);

    const dispatch = useDispatch();

    const onClickAddStep = () => {
        dispatch(addStep(configuration.id, art.id));
    };

    return (
        <ul>
            { steps.map((step, i) => <li onClick={() => props.onClickStep(step)} key={i}>Step {i + 1}</li>)}
            <li onClick={onClickAddStep} key={'add'}>Add step</li>
        </ul>
    );
}