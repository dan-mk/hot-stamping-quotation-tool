import { useDispatch } from 'react-redux';
import { addStep, deleteStep } from './../../../redux/actions/configurationActions';
import './../../../css/steps-tabs.css';

export function StepsTabs(props) {
    const configuration = props.configuration;
    const art = props.art;
    const currentStep = props.currentStep;
    const setCurrentStep = props.setCurrentStep;
    const steps = Object.values(configuration.arts[art.index].steps);

    const isConfigurationFinished = props.isConfigurationFinished;

    const dispatch = useDispatch();

    const onClickAddStep = () => {
        dispatch(addStep(art.index));
        setCurrentStep(steps.length + 1);
    };

    const onClickDeleteStep = () => {
        dispatch(deleteStep(art.index, currentStep));
        if (currentStep === steps.length) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <ul id="steps-nav">
            { steps.map((step, i) => <li className={currentStep === i + 1 ? 'selected-step' : ''} onClick={() => props.onClickStep(step)} key={i}>Step {i + 1}</li>)}
            { !isConfigurationFinished && <li id="add-step" onClick={onClickAddStep} title="Add new step" key={'add'}>+</li> }
            { !isConfigurationFinished && <li
                id="remove-step"
                onClick={onClickDeleteStep}
                title='Delete current step'
                key={'remove'}
                className={steps.length === 1 ? 'delete-step-disabled' : ''} >
                <img src="/times-solid.svg"/>
            </li> }
        </ul>
    );
}