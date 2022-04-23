import { useDispatch } from 'react-redux';
import { addStep, deleteStep } from '../redux/actions';
import '../css/steps-tabs.css';

export function StepsTabs(props) {
    const configuration = props.configuration;
    const art = props.art;
    const currentStep = props.currentStep;
    const setCurrentStep = props.setCurrentStep;
    const steps = Object.values(configuration.arts[art.id].steps);

    const dispatch = useDispatch();

    const onClickAddStep = () => {
        dispatch(addStep(configuration.id, art.id));
        setCurrentStep(steps.length + 1);
    };

    const onClickDeleteStep = () => {
        dispatch(deleteStep(configuration.id, art.id, currentStep));
        if (currentStep === steps.length) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <ul id="steps-nav">
            { steps.map((step, i) => <li className={currentStep === i + 1 ? 'selected-step' : ''} onClick={() => props.onClickStep(step)} key={i}>Step {i + 1}</li>)}
            <li id="add-step" onClick={onClickAddStep} title="Add new step" key={'add'}>+</li>
            <li
                id="remove-step"
                onClick={onClickDeleteStep}
                title='Delete current step'
                key={'remove'}
                className={steps.length === 1 ? 'delete-step-disabled' : ''} >
                <img src="times-solid.svg"/>
            </li>
        </ul>
    );
}