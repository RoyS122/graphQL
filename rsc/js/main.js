import { login_page, login_connexion } from "./login.js";// check dans le local storage si il y a un user valide, pour decider de la direction

const user_log_info_str = localStorage.getItem("user_login");
const userData = localStorage.getItem('user_login');
console.log("user_log_info : ", user_log_info_str)

if (user_log_info_str) {
    login_connexion()
} else {
    login_page()
}