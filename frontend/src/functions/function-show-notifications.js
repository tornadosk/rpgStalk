import { Loading, Notify } from 'quasar'

function showErrorNotification (errorMessage) {
  Loading.hide()

  Notify.create({
    color: 'negative',
    position: 'top',
    message: errorMessage,
    icon: 'report_problem'
  })
}

function showSuccessNotification (message) {
  Loading.hide()

  Notify.create({
    color: 'positive',
    textColor: 'white',
    icon: 'done',
    position: 'top',
    message
  })
}
function alertOnHealthLoss (message) {
  Loading.hide()

  Notify.create({
    color: 'negative',
    textColor: 'white',
    icon: 'warning',
    position: 'center',
    iconSize: '30px',
    classes: 'bigNotification',
    message
  })
}

export { showErrorNotification, showSuccessNotification, alertOnHealthLoss }
