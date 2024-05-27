import * as Constant from "./const.js";
import { show_user_info } from "./user_page.js";

export async function getData() {
  Constant.param.body = JSON.stringify(Constant.user_info);
  

  const response_user_info = await fetch(Constant.apiGraphQLUrl, Constant.param);
  const user_data = await response_user_info.json();


  console.log("INFO COMPLETES USER ! ratio audit : " , user_data)

    const loginSection = document.getElementById('log_section');
  if (loginSection) {
    loginSection.style.display = 'none';
  }
  show_user_info(user_data)
}
  //thomas.delestre.pro@gmail.com