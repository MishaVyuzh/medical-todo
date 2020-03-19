
/* eslint-disable no-underscore-dangle */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import { Field, reduxForm, Form } from 'redux-form';
import {
  Button, FormGroup, Label,
} from 'reactstrap';
import { connect } from 'react-redux';
import store from '../../../redux/store';

import ChangingDrugs from './ChangingDrugs';
import ChangingTheraphy from './ChangingTheraphies';
import ChangingAnalysis from './ChangingAnalysis';
import AddReports from '../AddComponents/AddReports';
import NextVisitFields from '../AddComponents/AddNextVisit';

function indexMethod(email, methodics) {
  for (let i = 0; i < methodics.length; i += 1) {
    if (methodics[i].patientEmail === email) { return i; }
  }
  return true;
}

async function saveClick(props) {
  const { values } = store.getState().form.method;
  const nameOfDrug = [];
  const dosage = [];
  const frequency = [];
  const duration = [];
  const beforeAfterEat = [];
  const frequencyOfTheraphy = [];
  const nameOfTheraphy = [];
  const durationOfTheraphy = [];
  const nameOfAnalysis = [];
  const drugs = [];
  const theraphies = [];
  const patientReports = [];
  const { email, doctorName, specialist } = props.user;


  for (const key in values) {
    if (key.match(/^nameOfDrug/)) {
      nameOfDrug.push(values[key]);
    }
    if (key.match(/^dosage/)) {
      dosage.push(values[key]);
    }
    if (key.match(/^frequency_/)) {
      frequency.push(values[key]);
    }
    if (key.match(/^beforeAfterEat/)) {
      beforeAfterEat.push(values[key]);
    }
    if (key.match(/^duration_/)) {
      duration.push(values[key]);
    }
    if (key.match(/^nameOfTheraphy/)) {
      nameOfTheraphy.push(values[key]);
    }
    if (key.match(/^frequencyOfTheraphy/)) {
      frequencyOfTheraphy.push(values[key]);
    }
    if (key.match(/^durationOfTheraphy/)) {
      durationOfTheraphy.push(values[key]);
    }
    if (key.match(/^nameOfAnalysis/)) {
      nameOfAnalysis.push(values[key]);
    }
  }

  for (let i = 0; i < nameOfDrug.length; i += 1) {
    drugs[i] = {
      nameOfDrug: nameOfDrug[i],
      dosage: dosage[i],
      frequency: frequency[i],
      beforeAfterEat: beforeAfterEat[i],
      duration: duration[i],
    };
  }
  for (let i = 0; i < nameOfTheraphy.length; i += 1) {
    theraphies[i] = {
      nameOfTheraphy: nameOfTheraphy[i],
      frequency: frequencyOfTheraphy[i],
      duration: durationOfTheraphy[i],
    };
  }
  if (values !== undefined) {
    if (values.needCheckConditions !== undefined) patientReports.push('Необходимо ведение дневника лечения.');
    if (values.needDiary !== undefined) patientReports.push('Необходимо отмечать все побочные действия.');
    if (values.needPhoto !== undefined) patientReports.push('Фотоотчет по результатам лечения.');
  }
  const date = new Date();
  const indMethod = indexMethod(props.currentPatientEmail, props.methodics);
  const DateOfTheLastVisit = props.methodics[indMethod].dateOfTheLastVisit;
  const methodic = {
    patientName: values.patientName,
    patientEmail: values.email,
    doctorEmail: email,
    drugs,
    theraphies,
    analisis: nameOfAnalysis,
    comment: values.comments,
    patientReports,
    nextVisit: values.nextVisit,
    dateOfTheLastVisit: DateOfTheLastVisit,
    sourceData: values,
    doctorName,
    specialist,
    dateOfTheLastChanges: date,
  };
  const numberID = props.methodics[indMethod]._id;
  await fetch(`${process.env.PATH_DEV}changemethod`, {
    method: 'POST',
    headers:
    {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      methodic,
      numberID,
    }),
  });
  props.toggle();
  window.location.reload();
}

async function deleteClick(props) {
  const indMethod = indexMethod(props.currentPatientEmail, props.methodics);
  const numberID = props.methodics[indMethod]._id;
  await fetch(`${process.env.PATH_DEV}changemethod`, {
    method: 'POST',
    headers:
    {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      numberID,
    }),
  });
  props.toggle();
  window.location.reload();
}

function MainMethodFormChange(props) {
  return (
    <>
      <Form id="NewPatient">
        <FormGroup>
          <Label for="exampleText">Имя пользователя</Label>
          <Field
            style={{
              marginLeft: '25px', width: '350px', borderRadius: '5px', height: '35px',
            }}
            type="text"
            name="patientName"
            id="patientName"
            placeholder="ФИО"
            component="input"
          />
        </FormGroup>

        <FormGroup>
          <Label for="exampleEmail"> Электронная почта пациента   </Label>
          <Field
            style={{
              marginLeft: '30px', width: '350px', borderRadius: '5px', height: '35px',
            }}
            type="email"
            name="email"
            id="exampleEmail"
            placeholder="example@example.com"
            component="input"
          />
        </FormGroup>

        <Label for="exampleSelect"> Назначение лекарств </Label>
        <ChangingDrugs />
        <br />

        <Label for="exampleSelect">Назначение Терапии</Label>
        <ChangingTheraphy />
        <br />

        <Label for="exampleSelect">Назначение Анализов</Label>
        <ChangingAnalysis />
        <br />

        <FormGroup>
          <Label for="exampleText">Комментарий</Label>
          <br />
          <Field
            style={{
              width: '550px',
              borderRadius: '5px',
              height: '85px',
            }}
            type="text"
            name="comments"
            id="exampleEmail"
            placeholder="Дополнения"
            component="textarea"
          />
        </FormGroup>

        <AddReports />
        <NextVisitFields />
        <Button color="primary" onClick={() => saveClick(props)}>Сохранить</Button>
        <Button color="link" onClick={() => deleteClick(props)}>Удалить</Button>
      </Form>
    </>
  );
}

const MethodFormChange = reduxForm({
  form: 'method',
})(MainMethodFormChange);

const mapStateToProps = (state) => ({
  user: state.logIn.user,
  email: state.logIn.user.email,
  methodics: state.getInfo.methodics,
  initialValues:
    state
      .getInfo
      .methodics[indexMethod(state.switchFormReducer.currentPatientEmail, state.getInfo.methodics)]
      .sourceData,
  currentPatientEmail: state.switchFormReducer.currentPatientEmail,
});

export default connect(mapStateToProps)(MethodFormChange);
