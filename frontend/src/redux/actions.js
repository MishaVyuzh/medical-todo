const {
  LOG_IN,
  LOG_OUT,
  IS_LOGIN_FORM,
  CHANGE_INFO_USER,
  GET_METHODICS_USER,
  PATIENT_DATA,
  SWITCH_CURRENT_EMAIL,
  ANALYZES_DATA,
  SWITCH_STATUS_TASK,
} = require('./action-types');

// Action creators
export const isLogined = (user) => ({
  type: LOG_IN,
  user,
});
export const isLogout = () => ({
  type: LOG_OUT,
});
export const isLoginForm = () => ({
  type: IS_LOGIN_FORM,
});
export const changeInfoUser = (user) => ({
  type: CHANGE_INFO_USER,
  user,
});
export const getMethodicsUser = (methodics) => ({
  type: GET_METHODICS_USER,
  methodics,
});
export const isPatientData = (patient) => ({
  type: PATIENT_DATA,
  patient,
});
export const switchCurrentEmail = (currentPatientEmail) => ({
  type: SWITCH_CURRENT_EMAIL,
  currentPatientEmail,
});
export const setAnalyzes = (analyzes) => ({
  type: ANALYZES_DATA,
  payload: analyzes,
});
export const switchStatusTask = (methodics) => ({
  type: SWITCH_STATUS_TASK,
  methodics,
});
