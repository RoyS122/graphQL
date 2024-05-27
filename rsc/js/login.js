import * as Constant from './const.js';
import { getData } from './get_data.js';
import {showAlert} from './alerts.js';

export function login_page() {

  const section = document.createElement("section")
  section.id = "log_section"

  const form_container = document.createElement("div")
  // Create the wrapper element
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';

  // Create the header element
  const h1 = document.createElement('h1');
  h1.textContent = 'Login';

  // Create the input boxes
  const inputBoxes = [];
  const inputFields = [
    { type: 'text', placeholder: 'Username', name: 'username', id: 'username' },
    { type: 'password', placeholder: 'Password', name: 'password', id: 'password' },
  ];

  inputFields.forEach((field) => {
    const inputBox = document.createElement('div');
    inputBox.className = 'input-box';

    const input = document.createElement('input');
    input.type = field.type;
    input.placeholder = field.placeholder;
    input.name = field.name;
    input.id = field.id;
    input.required = true;
    input.classList.add(
      "form-control",
    )

    const icon = document.createElement('i');
    icon.className = `bx ${field.type === 'password'? 'bxs-lock-alt' : 'bxs-user'}`;

    inputBox.classList.add(
      "col-6",
      "mb-2",
      "mx-auto",
    )
    inputBox.appendChild(icon);
    inputBox.appendChild(input);

    inputBoxes.push(inputBox);
  });

  // Create the login button
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn';
  button.textContent = 'Login';
  button.classList.add(
    "btn",
    "btn-primary",
    "col-md-4",
    "text-center",
    "justify-content-center",
    "mx-auto",
  )
  // Assemble the page
  wrapper.appendChild(h1);
  inputBoxes.forEach((inputBox) => wrapper.appendChild(inputBox));
  wrapper.appendChild(button);
  wrapper.id = "login_wrap"

  section.classList.add("vh-100");

  form_container.classList.add(
    "row",
    "d-flex",
    "justify-content-center",
    "align-items-center",
    "h-100"
  )

  wrapper.classList.add(
    "card",
    "text-center",
    "col-md-5",
    "py-3"
  )

  // Add event listener to the login button
  button.addEventListener('click', login_connexion)
  form_container.appendChild(wrapper)
  section.appendChild(form_container)
  // Add the wrapper to the body
  document.body.appendChild(section);
}

export function login_connexion() {
    const user_log_info_str= localStorage.getItem('user_login');
    if (user_log_info_str) {
        const user_log_info = JSON.parse(user_log_info_str);
        const username = user_log_info.username;
        const password = user_log_info.password;
        authenticate(username, password);
 
    } else {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        authenticate(username, password);
    }
}

function authenticate(username, password) {
  const user_log_info = {
    username: username,
    password: password
  };

  const user_log_info_str = JSON.stringify(user_log_info);



  const b_to_var = btoa(username + ":" + password)
  console.log("b_to_var : " , b_to_var)

  fetch(Constant.ApiSignin, {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + b_to_var
    },
  })

    .then(response => {
      console.log("récupération de la reponse, valeur inconnu à cette endroit")
      if (!response.ok) {
          console.log('response.status : ', response.status);
          if (response.status === 401) {
              showAlert('danger', 'User not found', 'Cette utilisateur na pas était trouvé ou n\'est pas authorisé a se connecter')
            } else {
              showAlert('danger', 'Erreur', response.status)
          }
          localStorage.removeItem("user_login");
          throw new Error(`Erreur : ${response.status}`);
      }
      localStorage.setItem("user_login", user_log_info_str)
      return response.json();
    })

    .then(data => {
      console.log("fetch des donnée utilisateur accepté")
      Constant.content_type.Authorization = "Bearer " + data
      getData(Constant.content_type)
      .then(() => console.log("Données récupérées avec succès"))
      .catch(error => console.error("Erreur lors de la récupération des données :", error));
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données:', error);
  });
}