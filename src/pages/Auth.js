import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import firebase, { db } from '../firebase';
import 'firebase/auth';
import 'firebase/firestore';
import { Link, useHistory } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import Modal from '../components/Modal';

const CustomerAuth = (props) => {
    const authContext = useContext(AuthContext);
    const history = useHistory();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [nonFieldErrorMessage, setNonFieldErrorMessage] = useState(null);
    const [emailErrorMessage, setEmailErrorMessage] = useState(null);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);
    const [phoneErrorMessage, setPhoneErrorMessage] = useState(null);
    const [passwordResetError, setPasswordResetError] = useState(null);
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(null);
    const [modal, toggleModal] = useState(false);

    const resetInputFields = () => {
        setPassword('');
        setRetypePassword('');
        setEmail('');
        setFirstName('');
        setLastName('');
        setPhone('');
        setEmail('');
    };

    const resetErrorMessages = () => {
        setNonFieldErrorMessage(null);
        setEmailErrorMessage(null);
        setPasswordErrorMessage(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        resetErrorMessages();
        if (props.isNewCustomer) {
            createCustomerAccount();
        } else {
            loginCustomerAccount();
        }
        resetInputFields();
    };

    const formatPhoneNumber = (phoneNumberString) => {
        let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
        let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            let intlCode = match[1] ? `+${match[1]}` : '+1';
            return [intlCode, match[2], match[3], match[4]].join('');
        }
        return null;
    };

    const verifyPassword = () => {
        if (password !== retypePassword) return false;
        else return true;
    };

    const handleFormSwitch = (e) => {
        e.preventDefault();
        props.setNewCustomer(!props.isNewCustomer);
    };

    const createCustomerAccount = async () => {
        if (!verifyPassword())
            return setPasswordErrorMessage("Passwords don't match.");
        let phoneNumber = formatPhoneNumber(phone);
        const input = {
            firstName: firstName,
            lastName: lastName,
            phone: phoneNumber,
            email: email,
            password: password,
        };

        await props
            .customerCreate({ variables: { input } })
            .then((res) => {
                if (res.data.customerCreate.customer) {
                    firebase
                        .auth()
                        .createUserWithEmailAndPassword(
                            input.email,
                            input.password
                        )
                        .then((user) => {
                            authContext.setUser(user);
                            db.collection('users')
                                .doc(user.user.uid)
                                .set(res.data.customerCreate.customer)
                                .catch((error) => {
                                    setNonFieldErrorMessage(error.message);
                                });
                        })
                        .catch((error) => {
                            return setEmailErrorMessage(error.message);
                        });
                    props.showAccountVerificationMessage();
                } else {
                    let errors = [];
                    res.data.customerCreate.userErrors.forEach((error) => {
                        errors.push(error);
                        if (error.field && error.field[1] === 'email') {
                            setEmailErrorMessage(error.message);
                        } else if (
                            error.field &&
                            error.field[1] === 'password'
                        ) {
                            setPasswordErrorMessage(error.message);
                        } else if (error.field && error.field[1] === 'phone') {
                            setPhoneErrorMessage(error.message);
                        } else {
                            setNonFieldErrorMessage(error.message);
                        }
                    });
                    throw errors;
                }
            })
            .then(() => {
                loginCustomerAccount();
            })
            .catch((error) => {
                setNonFieldErrorMessage(error.message);
            });
    };

    const loginCustomerAccount = () => {
        const input = {
            email: email,
            password: password,
        };

        props
            .customerAccessTokenCreate({ variables: { input } })
            .then((res) => {
                if (res.data.customerAccessTokenCreate.customerAccessToken) {
                    let accessToken =
                        res.data.customerAccessTokenCreate.customerAccessToken
                            .accessToken;
                    let expirationDate = new Date(
                        res.data.customerAccessTokenCreate.customerAccessToken.expiresAt
                    );
                    firebase
                        .auth()
                        .signInWithEmailAndPassword(input.email, input.password)
                        .then((res) => {
                            Cookie.set('_session_digest', accessToken, {
                                expires: expirationDate,
                                sameSite: 'strict',
                            });
                            authContext.setUser(res);
                        })
                        .then(() => {
                            props.setCustomerAccessToken(accessToken);
                            props.associateCustomerCheckout(accessToken);
                            history.push('/');
                        })
                        .catch((error) => {
                            setNonFieldErrorMessage(error.message);
                        });
                } else {
                    res.data.customerAccessTokenCreate.userErrors.forEach(
                        (error) => {
                            if (error.field && error.field === 'email') {
                                setEmailErrorMessage(error.message);
                            } else if (
                                error.field &&
                                error.field === 'password'
                            ) {
                                setPasswordErrorMessage(error.message);
                            } else {
                                setNonFieldErrorMessage(error.message);
                            }
                        }
                    );
                }
            })
            .catch((err) => {
                setNonFieldErrorMessage(`Something went wrong: ${err.message}`);
            });
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        try {
            firebase
                .auth()
                .sendPasswordResetEmail(email)
                .then(() => {
                    setPasswordResetSuccess('sent email to reset password');
                    setTimeout(() => {
                        toggleModal(false);
                    }, 2000);
                })
                .catch((err) => {
                    setPasswordResetError('could not send reset email');
                });
        } catch (err) {
            setPasswordResetError(`${err}}`);
        }
        resetInputFields();
    };

    const showModal = (e) => {
        e.preventDefault();
        toggleModal(true);
    };

    const hideModal = () => toggleModal(false);

    return (
        <div className="auth">
            <Link className="auth-close" to="/">
                ×
            </Link>
            <div className="auth-body">
                <h2 className="auth-heading">
                    {props.isNewCustomer
                        ? 'Create your Account'
                        : 'Log in to your account'}
                </h2>
                {nonFieldErrorMessage && (
                    <div className="error">{nonFieldErrorMessage}</div>
                )}
                {emailErrorMessage && (
                    <div className="error">{emailErrorMessage}</div>
                )}
                {passwordErrorMessage && (
                    <div className="error">{passwordErrorMessage}</div>
                )}
                {phoneErrorMessage && (
                    <div className="error">{passwordErrorMessage}</div>
                )}
                <form onSubmit={handleSubmit}>
                    {props.isNewCustomer ? (
                        <div>
                            <label className="auth-credential">
                                <input
                                    className="auth-input"
                                    type="text"
                                    placeholder="First name"
                                    name={'firstName'}
                                    value={firstName}
                                    onChange={(event) => {
                                        setFirstName(event.target.value);
                                    }}
                                ></input>
                            </label>
                            <label className="auth-credential">
                                <input
                                    className="auth-input"
                                    type="text"
                                    placeholder="Last name"
                                    name={'lastName'}
                                    value={lastName}
                                    onChange={(event) => {
                                        setLastName(event.target.value);
                                    }}
                                ></input>
                            </label>
                            <label className="auth-credential">
                                <input
                                    className="auth-input"
                                    type="text"
                                    placeholder="Phone number"
                                    name={'phone'}
                                    value={phone}
                                    onChange={(event) => {
                                        setPhone(event.target.value);
                                    }}
                                ></input>
                            </label>
                        </div>
                    ) : null}
                    <label className="auth-credential">
                        <input
                            className="auth-input"
                            type="email"
                            placeholder="Email"
                            name={'email'}
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                            }}
                        ></input>
                    </label>
                    <label className="auth-credential">
                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Password"
                            name={'password'}
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        ></input>
                    </label>
                    {props.isNewCustomer ? (
                        <label className="auth-credential">
                            <input
                                className="auth-input"
                                type="password"
                                placeholder="Re-type Password"
                                name={'retypePassword'}
                                value={retypePassword}
                                onChange={(event) =>
                                    setRetypePassword(event.target.value)
                                }
                            ></input>
                        </label>
                    ) : null}
                    <div className="auth-submit-wrapper">
                        <button
                            className="auth-submit button"
                            type="submit"
                            onClick={(e) => handleSubmit(e)}
                        >
                            {props.isNewCustomer ? 'Create' : 'Log in'}
                        </button>
                    </div>
                    <div className="auth-switch">
                        <button
                            className="new-customer-toggle"
                            onClick={(e) => handleFormSwitch(e)}
                        >
                            {!props.isNewCustomer
                                ? "Don't have an account?"
                                : 'Already have an account?'}
                        </button>
                    </div>
                    <div className="auth-reset">
                        <button
                            className="password-reset-link"
                            onClick={(e) => showModal(e)}
                        >
                            Forgot password?
                        </button>
                    </div>
                </form>
            </div>
            <Modal show={modal} handleClose={hideModal}>
                <div className="password-reset-modal">
                    {passwordResetError && (
                        <div className="error password-reset-notification">
                            {passwordResetError}
                        </div>
                    )}
                    {passwordResetSuccess && (
                        <div className="success password-reset-notification">
                            {passwordResetSuccess}
                        </div>
                    )}
                    <label className="auth-credential">
                        <input
                            className="auth-input password-reset-email-input"
                            type="email"
                            placeholder="Enter email to reset password"
                            name={'email'}
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                            }}
                        ></input>
                        <button
                            className="password-reset-button"
                            onClick={(e) => handlePasswordReset(e)}
                        >
                            Reset
                        </button>
                    </label>
                </div>
            </Modal>
        </div>
    );
};

CustomerAuth.propTypes = {
    customerCreate: PropTypes.func.isRequired,
    customerAccessTokenCreate: PropTypes.func.isRequired,
};

const customerCreate = gql`
    mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
            userErrors {
                field
                message
            }
            customer {
                id
                firstName
                lastName
                email
            }
        }
    }
`;

const customerAccessTokenCreate = gql`
    mutation customerAccessTokenCreate(
        $input: CustomerAccessTokenCreateInput!
    ) {
        customerAccessTokenCreate(input: $input) {
            userErrors {
                field
                message
            }
            customerAccessToken {
                accessToken
                expiresAt
            }
        }
    }
`;

const CustomerAuthWithMutation = compose(
    graphql(customerCreate, { name: 'customerCreate' }),
    graphql(customerAccessTokenCreate, { name: 'customerAccessTokenCreate' })
)(CustomerAuth);

export default CustomerAuthWithMutation;
