import { useState } from'react';
import PropTypes from 'prop-types';



const listImmutableUpdate = (srcList, idx, value) => {
    let newList = [...srcList];
    newList[idx] = value
    return newList;
};



const GridForm = (props) => {
    const [enteredValuesList, setEnteredValuesList] = useState(Array(props.inputs.length).fill(''));
    const [isTouchedList, setIsTouchedList] = useState(Array(props.inputs.length).fill(false));

    const onSubmitHandler = (event) => {
        event.preventDefault();
        let fieldValues = {}
        console.debug(props['inputs'])
        for (const [idx, ipDict] of props['inputs'].entries()) {
            fieldValues[ipDict.name] = enteredValuesList[idx];
        }
        props.onSubmit(fieldValues);
    }

    let all_touched = true;
    let all_valid = true;
    const form_rows = props['inputs'].map((ipDict, idx) => {
        const validateString = ipDict.validateFunc(enteredValuesList[idx]);
        const isValid = (validateString === null);
        const hasError = isTouchedList[idx] && !isValid;
        console.debug(`${ipDict.name}: hasError=${hasError}`)
        console.debug(`${ipDict.name}: isValid=${isValid}`)
        console.debug(`${ipDict.name}: isTouched=${isTouchedList[idx]}`)
        const errEl =
            hasError ? <p style={{border: "1px solid red", background: "red", borderRadius: "5px", gridColumn: "1 / span 2"}}>{validateString}</p>
                     : null;

        all_valid = all_valid && isValid;
        all_touched = all_touched && isTouchedList[idx];

        return (<>
            <label key={`lbl_${ipDict.name}`} htmlFor={ipDict.name}>{ipDict.label}:</label>
            <input
                type={ipDict.type}
                onChange={(e) => setEnteredValuesList(
                    listImmutableUpdate(enteredValuesList, idx, e.target.value))}
                onBlur={(e) => setIsTouchedList(listImmutableUpdate(isTouchedList, idx, true))}
                value={enteredValuesList[idx]}
                style={{marginBottom: "10px"}}
                name={ipDict.name}
                key={`input_${ipDict.name}`}
                autocomplete={ipDict["autocomplete"] ?? null}
            />
            {errEl}
        </>);
    });

    return (
        <form onSubmit={onSubmitHandler}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
                {form_rows}
                <div style={{display: "flex", flexDirection: 'row-reverse'}}>
                    <button
                        type="submit"
                        style={{marginLeft: "10px"}}
                        disabled={!(all_valid && all_touched)}
                    >
                        Submit
                    </button>
                    <button type="reset" onClick={props.onCancel}>Cancel</button>
                </div>
            </div>
        </form>
    );
};


GridForm.propTypes = {
    // Custom validator that verifies that inputs is a list of dictionaries where each dictionary
    // has the following shape and that each dictionary[name] is unique within that list.
    //     {
    //          name: String.isRequired, << Within the list this property must be unique
    //          label: String.isRequired
    //          type: String.isRequired,
    //          validateFunc: function.isRequired
    //          autocomplete: String << Optional.
    //     }
    inputs: function(props, propName, componentName) {
        if (!props.hasOwnProperty(propName)) {
            return new Error(
                `The prop ${propName} was not supplied to ${componentName} but is required. ` +
                "Validation failed."
            )
        }

        for (const dictObj in props[propName]) {
            const requiredKeys = [
                ["name", "string"],
                ["label", "string"],
                ["type", "string"],
                ["validateFunc", "function"]
            ];
            const hasRequiredKeys =
                requiredKeys.map(
                    x => (dictObj.hasOwnProperty(x[0]) && typeof(dictObj[x[0]]) === x[1])
                ).every(x => x);
            if (!hasRequiredKeys) {
                return new Error(
                    `Invalid prop ${propName} supplied to ${componentName} because at least one ` +
                    "dict in the list of dicts does not have a required key. Validation failed."
                )
            }

            const optionalKeys = [ ["autocomplete", "string"]]
            const optionalKeysAreCorrect =
                optionalKeys.map(
                    x => (!dictObj.hasOwnProperty(x[0]) || typeof(dictObj[x[0]]) === x[1])
                ).every(x => x);
            if (!optionalKeysAreCorrect) {
                return new Error(
                    `Invalid prop ${propName} supplied to ${componentName} because at least one ` +
                    "dict in the list of dicts has an optional key of invalid type. " +
                    "Validation failed."
                )
            }

            const hasRequiredKeysAndNamesAreAllUnique =
                Set(props[propName].map(x => x['name'])).size === props[propName].length;
            if (!hasRequiredKeysAndNamesAreAllUnique) {
                return new Error(
                    `Invalid prop ${propName} supplied to ${componentName} because at least two ` +
                    "dicts in the list of dicts have the same 'name' value. Validation failed."
                )
            }
        }
    },
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default GridForm;