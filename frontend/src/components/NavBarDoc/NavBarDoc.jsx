import React from 'react';
import { connect } from 'react-redux';
import PatientInfoDoc from './PatientInfoDoc';
import { getMethodicsUser } from '../../redux/actions';
import PationsList from './Components/PationsList';
import './NavBarDoc.css';

async function fetchEmail(props) {
  const { email } = props.user;
  const { getMethodics } = props;

  const res = await fetch(`${process.env.PATH_DEV}loadmethodic`, {
    method: 'POST',
    headers:
  {
    'Content-type': 'application/json',
  },
    body: JSON.stringify({
      email,
    }),
  });
  const result = await res.json();

  if (result) {
    return getMethodics(result);
  }
  return console.error('Что то пошло не так!');
}

function NavBarDoc(props) {
  fetchEmail(props);
  return (
    <div style={{ minHeight: '600px' }} id="NavBarDoc">
      <div style={{ minHeight: '600px' }} className="imgNB" />
      <div className="row">
        <div className="col-3">
          <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <PationsList />
          </div>
        </div>
        <div className="col-9">
          <div className="tab-content" id="v-pills-tabContent">
            <div className="tab-pane fade" id="v-pills-methodology" role="tabpanel" aria-labelledby="v-pills-methodology-tab">
              <PatientInfoDoc />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  user: state.logIn.user,
});

const mapDispatchToProps = (dispatch) => ({
  getMethodics: (methodics) => dispatch(getMethodicsUser(methodics)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavBarDoc);
