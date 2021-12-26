import { useDispatch } from 'react-redux';
import { addStep } from '../actions';
import '../css/steps-tabs.css';

export function StepsTabs(props) {
    const configuration = props.configuration;
    const art = props.art;
    const currentStep = props.currentStep;
    const steps = Object.values(configuration.arts[art.id].steps);

    const dispatch = useDispatch();

    const onClickAddStep = () => {
        dispatch(addStep(configuration.id, art.id));
    };

    return (
        <ul id="steps-nav">
            { steps.map((step, i) => <li className={currentStep === i + 1 ? 'selected-step' : ''} onClick={() => props.onClickStep(step)} key={i}>Step {i + 1}</li>)}
            <li id="add-step" onClick={onClickAddStep} key={'add'}>+</li>
        </ul>
    );
}