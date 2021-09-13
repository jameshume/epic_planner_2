import { useState } from'react';
import PropTypes from 'prop-types';



const listImmutableUpdate = (srcList, idx, value) => {
    let newList = [...srcList];
    newList[idx] = value
    return newList;
};



const GridForm = (props) => {
    const [enteredValuesList, setEnteredValuesList] = useState(new Array(props.inputs.length).fill(''));
    const [isTouchedList, setIsTouchedList] = useState(new Array(props.inputs.length).fill(false));

    let fieldValues = {}
    for (const [idx, ipDict] of props['inputs'].entries()) {
        fieldValues[ipDict.name] = enteredValuesList[idx];
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        props.onSubmit(fieldValues);
    }

    const onCancelHandler = () => {
        setEnteredValuesList(new Array(props.inputs.length).fill(''));
        setIsTouchedList(new Array(props.inputs.length).fill(false));
        props.onCancel();
    }

    let all_touched = true;
    let all_valid = true;
    const form_rows = props['inputs'].map((ipDict, idx) => {
        const validateString = ipDict.validateFunc(fieldValues);
        const isValid = (validateString === null);
        // This means, for all fields, when they are first entered the warning is not displayed
        // until they loose focus, and there after on each key stroke. However, for the last field
        // this is a problem because the form submit button will remain disabled if there is an
        // issue but no feedback and this is confusing. So to remedy this the isTouched is only
        // really used to stop errors until a field has received a keypress or lost focus
        // (in case there were no key presses).
        // TODO: Could make this fancy and wait until the user stops typing assuming a certain
        //       rate at which they type.
        const hasError = isTouchedList[idx] && !isValid;
        const errEl =
            hasError ?
                <p
                    key={`par_${ipDict.name}`}
                    style={{
                        border: "1px solid red",
                        background: "red",
                        borderRadius: "5px",
                        gridColumn: "1 / span 2"
                    }}
                >
                    {validateString}
                </p>
            : null;

        all_valid = all_valid && isValid;
        all_touched = all_touched && isTouchedList[idx];

        return (<>
            <label key={`lbl_${ipDict.name}`} htmlFor={ipDict.name}>{ipDict.label}:</label>
            <input
                key={`inp_${ipDict.name}`}
                type={ipDict.type}
                onChange={
                    (e) => {
                        setEnteredValuesList(listImmutableUpdate(
                            enteredValuesList, idx, e.target.value
                        ));
                        setIsTouchedList(listImmutableUpdate(isTouchedList, idx, true));
                    }
                }
                onBlur={(e) => setIsTouchedList(listImmutableUpdate(isTouchedList, idx, true))}
                value={enteredValuesList[idx]}
                style={{marginBottom: "10px"}}
                name={ipDict.name}
                autoComplete={ipDict["autocomplete"] ?? null}
            />
            {errEl}
        </>);
    });

    return (
        <form onSubmit={onSubmitHandler}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
                {form_rows}
            </div>
            <div style={{display: "flex", flexDirection: 'row-reverse'}}>
                <button
                    type="submit"
                    style={{marginLeft: "10px"}}
                    disabled={!all_valid}
                >
                    Submit
                </button>
                <button type="reset" onClick={onCancelHandler}>Cancel</button>
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

        for (const dictObj of props[propName]) {
            if (typeof(dictObj) !== "object") {
                console.error(props[propName]);
                return new Error(
                    `Invalid prop ${propName} supplied to ${componentName}: type ` +
                    `(${typeof(dictObj)}) is invalid`
                );
            }
            const requiredKeys = [
                ["name", "string"],
                ["label", "string"],
                ["type", "string"],
                ["validateFunc", "function"]
            ];
            const dictsWithRequiredKeys = requiredKeys.map(
                x => (dictObj.hasOwnProperty(x[0]) && typeof(dictObj[x[0]]) === x[1])
            );
            const allDictsHaveRequiredKeys = dictsWithRequiredKeys.every(x => x);
            if (!allDictsHaveRequiredKeys) {
                return new Error(
                    `Invalid prop ${propName} supplied to ${componentName} because at least one ` +
                    "dict in the list of dicts does not have a required key. Validation failed: " +
                    props[propName].reduce((prev, curr) => `${prev}, ${Object.keys(curr)}`, '') +
                    " -- " + JSON.stringify(dictsWithRequiredKeys)
                )
            }

            const optionalKeys = [["autocomplete", "string"]]
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
                (new Set(props[propName].map(x => x['name']))).size === props[propName].length;
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