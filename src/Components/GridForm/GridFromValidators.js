import {isNumeric, isLowerCase, isUpperCase, isSymbol} from '../../Common/StringUtils';

export const validatePasswordFunc = (field_name, values) => {
    const value = values[field_name];
    if (value.length <= 5) {
        return  "Password too short";
    }
    else {
        let hasDigit = false;
        let hasUpperCase = false;
        let hasLowerCase = false;
        let hasSymbol = false;
        for (const char of value) {
            hasDigit = hasDigit || isNumeric(char);
            hasUpperCase = hasUpperCase || isUpperCase(char);
            hasLowerCase = hasLowerCase || isLowerCase(char);
            hasSymbol = hasSymbol || isSymbol(char);
        }

        let requiresMsg = "";
        function appendToRequiresMsg(msg) {
            if (requiresMsg === "") requiresMsg = msg;
            else requiresMsg = `${requiresMsg}, ${msg}`;
        }
        if (!hasSymbol) appendToRequiresMsg("one symbol");
        if (!hasLowerCase) appendToRequiresMsg("one lower case character");
        if (!hasUpperCase) appendToRequiresMsg("one upper case character");
        if (!hasDigit) appendToRequiresMsg("one number");

        if (requiresMsg.length > 0) {
            return `Password requires at least ${requiresMsg}`;
        }
        else {
            return null;
        }
    }
};

export const validateEmailFunc = (field_name, values) => {
    const looksValid = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(values[field_name]));
    return looksValid ? null : "Invalid email address"
};
