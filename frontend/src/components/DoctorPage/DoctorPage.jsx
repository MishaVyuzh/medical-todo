import React, { useState } from 'react';
import {
  Button, Form, FormGroup, Label, Input, FormText,
} from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { changeInfoUser } from '../../redux/actions';
import './DoctorPage.css';
import { storage } from '../../firebase';

const DoctorPage = (props) => {
  const [image, setImage] = useState(null);
  const { doctorName, specialist } = props.user;

  const handleChange = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      setImage(image);
    }
  };

  const loadHandler = async (e, props) => {
    e.preventDefault();

    const doctorName = e.target.doctorName.value;
    const specialist = e.target.specialist.value;
    const { email } = props.user;
    const { changeInfo } = props;
    const { action } = e.target;

    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on('state_changed',
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        console.log(error);
      },
      async () => {
        const url = await storage.ref('images').child(image.name).getDownloadURL();

        const response = await fetch(action, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            doctorName,
            specialist,
            email,
            url,
          }),
        });

        const result = await response.json();

        const user = result.newUser;
        changeInfo(user);

        return props.history.push('/');
      });
  };

  return (
    <div className="doctorPage">
      <Form method="POST" action={`${process.env.PATH_DEV}personal/doctor`} onSubmit={(e) => loadHandler(e, props)}>
        <FormGroup>
          <Label for="doctorName">Имя  Отчество  Фамилия</Label>
          <Input type="doctorName" name="doctorName" id="doctorName" placeholder="Введите Имя, Фамилию и Отчество" defaultValue={doctorName} />
        </FormGroup>
        <FormGroup>
          <Label for="specialist">Специальность</Label>
          <Input type="specialist" name="specialist" id="specialist" placeholder="Введите специальность" defaultValue={specialist} />
        </FormGroup>
        <FormGroup>
          <Label for="exampleFile">Фото</Label>
          <Input type="file" name="file" onChange={handleChange} />
          <FormText color="muted" />
        </FormGroup>
        <Button type="submit">Изменить</Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.logIn.user,
});

const mapDispathToProps = (dispatch) => ({
  changeInfo: (user) => dispatch(changeInfoUser(user)),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispathToProps,
)(DoctorPage));
