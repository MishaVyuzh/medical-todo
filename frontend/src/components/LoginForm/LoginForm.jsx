import React, { useState } from 'react';
import {
  Button, Form, FormGroup, Label, Input,
} from 'reactstrap';
import './LoginForm.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isLogined } from '../../redux/actions';
import SignInButton from '../SignInButton/SignInButton';

const createUser = async (event, props, setErrorReg) => {
  event.preventDefault();

  const email = event.target.email.value;
  const password = event.target.password.value;
  const isLogin = props.isLogined;
  const response = await fetch(`${process.env.PATH_DEV}auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email, password,
    }),
  });
  const result = await response.json();
  if (result.answer) {
    const { user } = result;
    isLogin(user);
    return props.history.push('/');
  }
  return setErrorReg(true);
};

const LoginForm = (props) => {
  const [errorReg, setErrorReg] = useState(false);

  return (
    <>
      <Form className="loginForm" onSubmit={(event) => createUser(event, props, setErrorReg)}>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="exampleEmail" className="mr-sm-2">Почта</Label>
          <Input type="email" name="email" id="exampleEmail" placeholder="fox@fox.ru"  required />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="examplePassword" className="mr-sm-2">Пароль</Label>
          <Input type="password" name="password" id="examplePassword" placeholder="Не забудь пароль!" 
                  pattern="[\w]{5,30}"
                  title="Пароль должен содержать минимум 6 символов."
                  required />
        </FormGroup>
        <Button type="submit" className="loginBtn logB">Войти</Button>
        <SignInButton />
      </Form>
      {
        errorReg && <h3>Неправильно введены почта или пароль</h3>
      }
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.logIn.auth,
  user: state.logIn.user,
});

const mapDispatchToProps = (dispatch) => ({
  isLogined: (userName, statusUser, email) => dispatch(isLogined(userName, statusUser, email)),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginForm));
