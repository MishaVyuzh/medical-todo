import React, { useState } from 'react';
import {
  Button, Form, FormGroup, Label, Input,
} from 'reactstrap';
import './RegistrationForm.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isLogined } from '../../redux/actions';
import SignInButton from '../SignInButton/SignInButton';

const createUser = async (event, props, setErrorReg) => {
  event.preventDefault();

  const login = event.target.login.value;
  const email = event.target.email.value;
  const password = event.target.password.value;
  const statusUser = event.target.statusUser.value;
  const isLogin = props.isLogined;


  const response = await fetch(`${process.env.PATH_DEV}auth/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login, email, password, statusUser,
    }),
  });
  const result = await response.json();
  const { user } = result;

  if (user) {
    isLogin(user);
    return props.history.push('/');
  }
  return setErrorReg(true);
};

const RegistrationForm = (props) => {
  const [errorReg, setErrorReg] = useState(false);

  return (
    <div className="formForRegistr">
      <div className="loginform">
        <Form className="registrationForm" onSubmit={(event) => createUser(event, props, setErrorReg)}>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label for="exampleLogin" className="mr-sm-2">Логин</Label>
            <Input
              type="text"
              name="login"
              id="exampleLogin"
              placeholder="Введите логин"
              pattern="[\w]{3,}"
              title="Логин может содержать только латинские символы и цифры и минимум 3 символа."
              required
            />
          </FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label for="exampleEmail" className="mr-sm-2">Почта</Label>
            <Input type="email" name="email" id="exampleEmail" placeholder="Введите почту" required />
          </FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label for="examplePassword" className="mr-sm-2">Пароль</Label>
            <Input
              type="password"
              name="password"
              id="examplePassword"
              placeholder="Введите пароль из 6 символов"
              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$"
              title="Пароль должен содержать, по крайней мере, одну цифру и одну заглавную и строчную буквы, и, по крайней мере, 6 или более символов"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="exampleSelect">Выберите статус</Label>
            <Input type="select" name="statusUser" id="exampleStatusUser">
              <option>patient</option>
              <option>doctor</option>
            </Input>
          </FormGroup>
          <Button type="submit" className="registrationBtn">Зарегистрироваться</Button>
          <SignInButton />
        </Form>
      </div>
      {
        errorReg && <h3>Такая почта уже зарегистрирована.</h3>
      }
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  userName: state.userName,
});

const mapDispatchToProps = (dispatch) => ({
  isLogined: (user) => dispatch(isLogined(user)),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrationForm));
