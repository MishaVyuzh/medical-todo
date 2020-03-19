import React from 'react';
import { connect } from 'react-redux';
import Methodology from '../Methodology/Methodology';
import ActiveTasks from '../ActiveTasks/ActiveTasks';
import DoctorList from '../DoctorList/DoctorList';
import { getMethodicsUser } from '../../redux/actions';
import PatientAccount from '../PatientAccount/PatientAccount';
import './PatientSidebar.css';
import PatientAnalyzes from '../PatientAnalyzes/PatientAnalyzes';

const getInfo = async (props) => {
  const { email } = props.user;
  const { getMethodics } = props;
  const response = await fetch(`${process.env.PATH_DEV}users/info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  });
  const result = await response.json();
  const { methodics } = result;
  if (methodics) {
    return getMethodics(methodics);
  }
  return console.error('Что то пошло не так!');
};

const PatientSidebar = (props) => {
  getInfo(props);

  return (
    <>
      <div className="row">
        <div className="col-3">
          <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <a className="nav-link active" id="v-pills-activeTasks-tab" data-toggle="pill" href="#v-pills-activeTasks" role="tab" aria-controls="v-pills-activeTasks" aria-selected="true">Активные задачи</a>
            <a className="nav-link" id="v-pills-methodology-tab" data-toggle="pill" href="#v-pills-methodology" role="tab" aria-controls="v-pills-methodology" aria-selected="false">Методика лечения</a>
            <a className="nav-link" id="v-pills-personalArea-tab" data-toggle="pill" href="#v-pills-personalArea" role="tab" aria-controls="v-pills-personalArea" aria-selected="false">Личный кабинет</a>
            <a className="nav-link" id="v-pills-personalAnalyzes-tab" data-toggle="pill" href="#v-pills-personalAnalyzes" role="tab" aria-controls="v-pills-personalAnalyzes" aria-selected="false">Мои анализы</a>
            <a className="nav-link" id="v-pills-personalsDoctor-tab" data-toggle="pill" href="#v-pills-personalsDoctor" role="tab" aria-controls="v-pills-personalsDoctor" aria-selected="false">Мои врачи</a>
          </div>
        </div>
        <div className="col-9">
          <div className="tab-content" id="v-pills-tabContent">
            <div className="tab-pane fade show active" id="v-pills-activeTasks" role="tabpanel" aria-labelledby="v-pills-activeTasks-tab"><ActiveTasks /></div>
            <div className="tab-pane fade" id="v-pills-methodology" role="tabpanel" aria-labelledby="v-pills-methodology-tab"><Methodology /></div>
            <div className="tab-pane fade" id="v-pills-personalArea" role="tabpanel" aria-labelledby="v-pills-personalArea-tab"><PatientAccount /></div>
            <div className="tab-pane fade" id="v-pills-personalAnalyzes" role="tabpanel" aria-labelledby="v-pills-personalAnalyzes-tab"><PatientAnalyzes /></div>
            <div className="tab-pane fade" id="v-pills-personalsDoctor" role="tabpanel" aria-labelledby="v-pills-personalsDoctor-tab"><DoctorList /></div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.logIn.user,
});

const mapDispatchToProps = (dispatch) => ({
  getMethodics: (methodics) => dispatch(getMethodicsUser(methodics)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientSidebar);
