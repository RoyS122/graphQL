import * as Const from './const.js'

export function showAlert(alertType, messageTitle, message) {
    Const.alertMainPage.innerHTML = ""
    Const.alertMainPage.innerHTML = `<div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
            <strong>${messageTitle}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`

    setTimeout(() => {
        Const.alertMainPage.innerHTML = ""
    }, 5000);
}