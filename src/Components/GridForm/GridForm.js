import {useState } from'react';
import PropTypes from 'prop-types';


const listImmutableUpdate = (srcList, idx, value) => {
    let newList = [...srcList];
    newList[idx] = value
    return newList;
};



const gridForm = (props) => {
    const [enteredValuesList, setEnteredValuesList] = useState(Array(props.inputs.length).fill(''));
    const [isTouchedList, setIsTouchedList] = useState(Array(props.inputs.length).fill(False));
    const onSubmitHandler = () => {
        event.preventDefault();
    }

    let all_touched = true;
    let all_valid = true;
    const form_rows = props['inputs'].map((ipDict, idx) => {
        const validateString = validateValue(enteredValuesList[idx]);
        const isValid = (validateString !== null);
        const hasError = isTouchedList[idx] && isValid;
        const errEl =
            hasError ? <><div style={{gridColumn: "1 / span 2"}}>{validateString}</div></>
                     : null;

        all_valid = all_valid & isValid;
        all_touched = all_touched & isTouchedList[idx];

        return (<>
            <label key={ipDict.name} htmlFor={ipDict.name}>{ipDict.label}:</label>
            <input
                type={ipDict.type}
                onChange={(e) => setEnteredValuesList(
                    listImmutableUpdate(enteredValuesList, idx, e.target.value))}
                onBlur={(e) => setIsTouchedList(listImmutableUpdate(isTouchedList, idx, true))}
                value={enteredValuesList[idx]}
                style={{marginBottom: "10px"}}
                name={ipDict.name}
                key={ipDict.name}
            />
            {errEl}
        </>);
    });

    <form onSubmit={onSubmitHandler}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
            {form_rows}
            <div style={{display: "flex", flexDirection: 'row-reverse'}}>
                <button
                    onClick={() => props.doSendResetCode(props.emailValue, props.passwordValue)}
                    style={{marginLeft: "10px"}}
                    disabled={!(all_valid && all_touched)}
                >
                    Submit
                </button>
                <button onClick={props.doCancel}>Cancel</button>
            </div>
        </div>
    </form>
};


gridForm.propTypes = {
    inputs: PropTypes.arrayOf(PropTypes.exact({
        name:  PropTypes.string,
        label: PropTypes.string,
        type:  PropTypes.string,
        validateFunc: PropTypes.func,
    })).isRequired,
    submitHandler: PropTypes.func.isRequired
};