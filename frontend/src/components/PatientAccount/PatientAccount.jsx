import React, { useState } from 'react';
import './PatientAccount.css';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { connect } from 'react-redux';
import { changeInfoUser } from '../../redux/actions';
import { storage } from '../../firebase';
import PatientAccountInfo from '../PatientAccountInfo/PatientAccountInfo';


const PatientAccount = (props) => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState(props.user);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      setImage(image);
    }
  };

  const formHandler = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const disease = e.target.disease.value;
    const { login } = props.user;
    const { action } = e.target;
    const { changeInfo } = props;

    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on('state_changed',
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        console.log(error);
      },
      async () => {
        const url = await storage.ref('images').child(image.name).getDownloadURL() || '';

        const response = await fetch(action, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            name,
            disease,
            login,
            url,
          }),
        });

        const result = await response.json();

        setData(result.user);
        changeInfo(result.user);
      });
  };


  return (
    <div className="patient-account">
      <PatientAccountInfo data={data} />
      <Form action={`${process.env.PATH_DEV}upload`} onSubmit={formHandler}>
        <FormGroup>
          <Label for="exampleEmail">ФИО</Label>
          <Input type="text" name="name" placeholder="ФИО" />
        </FormGroup>
        <FormGroup>
          <Label for="exampleText">Укажите хронические заболевания</Label>
          <Input type="textarea" name="disease" />
        </FormGroup>
        <FormGroup>
          <Label for="exampleFile">Фото</Label>
          <Input type="file" name="photo" onChange={handleChange} />
        </FormGroup>
        <Button type="submit">Отправить</Button>
      </Form>
    </div>
  );
};


const mapStateToProps = (state) => ({
  user: state.logIn.user,
  patientData: state.patientDataReducer.isPatientData,
});

const mapDispatchToProps = (dispatch) => ({
  changeInfo: (user) => dispatch(changeInfoUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientAccount);
