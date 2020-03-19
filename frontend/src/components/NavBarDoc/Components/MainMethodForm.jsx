/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import { Field, reduxForm, Form } from 'redux-form';
import {
  Button, FormGroup, Label,
} from 'reactstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import store from '../../../redux/store';

import Drugs from './Drugs';
import Theraphy from './Theraphies';
import Analysis from './AddAnalysis';
import AddReports from '../AddComponents/AddReports';
import NextVisitFields from '../AddComponents/AddNextVisit';

const getFinishTaskDate = (startTaskDate, delta) => {
  const finishTaskDate = moment(startTaskDate).add(delta, 'h').format();
  return finishTaskDate;
};

function createTasks(drugs, theraphies, nameOfAnalysis) {
  const drugsTasks = [];
  let taskName;
  let task;
  let taskDate;
  let taskHours;
  let dayTask;
  const deltaDrug = 3;
  const deltaTherapy = 24;


  for (let drugCount = 0; drugCount < drugs.length; drugCount += 1) {
    for (let dayTaskDrug = 0; dayTaskDrug < drugs[drugCount].duration; dayTaskDrug += 1) {
      taskName = `Примите ${drugs[drugCount].nameOfDrug}`;
      for (let frequencyDayTaskDrug = 0; frequencyDayTaskDrug < drugs[drugCount].frequency; frequencyDayTaskDrug += 1) {
        taskHours = 7 + (15 / (drugs[drugCount].frequency - 1)) * frequencyDayTaskDrug;
        taskDate = moment().add('days', dayTaskDrug).hours(taskHours).minutes(0)
          .seconds(0)
          .format();
        const finishTaskDate = getFinishTaskDate(taskDate, deltaDrug);
        task = {
          taskName: drugs[drugCount].nameOfDrug,
          type: 'drugs',
          massage: taskName,
          dateActivation: taskDate,
          finishTaskDate,
          status: 'default',
          idTask: (taskName + taskDate),
        };
        drugsTasks.push(task);
      }
    }
  }

  for (let theraphyCount = 0; theraphyCount < theraphies.length; theraphyCount += 1) {
    for (let dayTaskTheraphy = 0; dayTaskTheraphy < theraphies[theraphyCount].duration; dayTaskTheraphy += 1) {
      dayTask = (7 / theraphies[theraphyCount].frequency) * dayTaskTheraphy;
      if (dayTaskTheraphy !== 0) {
        taskDate = moment()
          .add('days', dayTask)
          .hours(0)
          .minutes(0)
          .seconds(0)
          .format();
      } else {
        taskDate = moment().format();
      }
      taskName = `Необходимо пройти ${theraphies[theraphyCount].nameOfTheraphy}`;
      const finishTaskDate = getFinishTaskDate(taskDate, deltaTherapy);
      task = {
        taskName: theraphies[theraphyCount].nameOfTheraphy,
        type: 'theraphy',
        massage: taskName,
        dateActivation: taskDate,
        finishTaskDate,
        status: 'default',
        idTask: (taskName + taskDate),
      };
      drugsTasks.push(task);
    }
  }
  for (let analysisCount = 0; analysisCount < nameOfAnalysis.length; analysisCount += 1) {
    console.log(analysisCount, nameOfAnalysis.length, nameOfAnalysis);
    task = {
      taskName: nameOfAnalysis[analysisCount],
      type: 'Analis',
      massage: `Нужен ${nameOfAnalysis[analysisCount]}`,
      status: 'default',
      idTask: (nameOfAnalysis[analysisCount]),
    };
    drugsTasks.push(task);
  }

  return drugsTasks;
}

function saveClick(props) {
  try {
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
    const date = new Date();
    for (let i = 0; i < nameOfDrug.length; i += 1) {
      drugs[i] = {
        nameOfDrug: nameOfDrug[i],
        dosage: dosage[i],
        frequency: frequency[i],
        beforeAfterEat: beforeAfterEat[i] || 'до',
        duration: duration[i],
        startOfTheDrugUsing: date,
      };
    }
    for (let i = 0; i < nameOfTheraphy.length; i += 1) {
      theraphies[i] = {
        nameOfTheraphy: nameOfTheraphy[i],
        frequency: frequencyOfTheraphy[i],
        duration: durationOfTheraphy[i],
        startOfTheTheraphyUsing: date,
      };
    }
    if (values !== undefined) {
      if (values.needCheckConditions !== undefined) patientReports.push('Необходимо ведение дневника лечения.');
      if (values.needDiary !== undefined) patientReports.push('Необходимо отмечать все побочные действия.');
      if (values.needPhoto !== undefined) patientReports.push('Фотоотчет по результатам лечения.');
    }
    const tasks = createTasks(drugs, theraphies, nameOfAnalysis);


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
      dateOfTheLastVisit: date,
      sourceData: values,
      doctorName,
      specialist,
      tasks,
    };

    fetch(`${process.env.PATH_DEV}savemethodic`, {
      method: 'POST',
      headers:
      {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        methodic,
      }),
    });
    props.toggle();
    return window.location.reload();

  } catch (e) {
    return alert('Something went Wrong!');
  }
}

const MainMethodForm = (props) => (
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
      <Drugs />
      <br />

      <Label for="exampleSelect">Назначение Терапии</Label>
      <Theraphy />
      <br />

      <Label for="exampleSelect">Назначение Анализов</Label>
      <Analysis />
      <br />

      <FormGroup>
        <Label for="exampleText">Комментарий</Label>
        <br />
        <Field style={{ width: '550px', borderRadius: '5px', height: '85px' }} type="text" name="comments" id="exampleEmail" placeholder="Дополнения" component="textarea" />
      </FormGroup>

      <AddReports />
      <NextVisitFields />
      <Button color="primary" onClick={() => saveClick(props)}>Сохранить</Button>
    </Form>
  </>
);

const mapStateToProps = (state) => ({
  user: state.logIn.user,
});

const MethodForm = reduxForm({
  form: 'method',
})(MainMethodForm);

export default connect(
  mapStateToProps,
)(MethodForm);
