import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HeadedDialog from '../../../Containers/Dialogs/HeadedDialog/HeadedDialog';
import BusyDialog from '../../../Containers/Dialogs/BusyDialog/BusyDialog';
import ErrorFragment from '../../../Containers/Fragments/ErrorFragment/ErrorFragment';
import * as Auth from '../../../Services/Auth/Auth';
import GridForm from '../../GridForm/GridForm';
import {isNumeric, isLowerCase, isUpperCase, isSymbol} from '../../../Common/StringUtils';

const EnterResetCodeDialogComponent = (props) => {
    <HeadedDialog isOpen={props.isOpen} onClose={props.doClose} title="Reset Your Password">
        <p>
            A reset code has been sent to your registered email address. Please enter the Code
            below:
        </p>
        <GridForm
            onSubmit={
                (values) => {
                    props.setEmailValue(values['email']);
                    return props.doSignUp(values['email'], values['password']);
                }
            }
            onCancel={() => props.doClose()}
            inputs={[
                {
                    name: "email", label: "Email", type: "email", autocomplete: "email",
                    validateFunc: (values) => value["email"].includes("@") ? null : "Invalid email address",
                },
            ]}
        >
        </GridForm>
    </HeadedDialog>
};