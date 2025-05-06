function createGraphXpTransactions(data, dateAxisSize, xpAxisSize, nbrLastMonth, nodeId) {
  const currentDate = new Date();
  let minimumDate = new Date();
 

  let startXP = 0;
  let totalXP = 0;
  
  minimumDate.setMonth(minimumDate.getMonth() - parseInt(nbrLastMonth));
  const valid_tx = data.data.transaction.filter((tx) => {
     console.log(tx)
     const date = new Date(tx.createdAt);
     totalXP += tx.amount;
   if (date < minimumDate) startXP += tx.amount;
    return date >= minimumDate
  })

  const axe_date = (minimumDate - currentDate) / 100;
  const axe_xp = (totalXP - startXP) / 100;
  console.log(axe_date, axe_xp)

  let currentXP = startXP;
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.height = `${xpAxisSize + xpAxisSize * 0.1}px`
  svg.style.width = `${dateAxisSize + dateAxisSize * 0.1}px`
  svg.style.padding = "0px"
  svg.style.margin = "0px"
  var svgNS = svg.namespaceURI;

  var rectDateAxis = document.createElementNS(svgNS,'rect');
  rectDateAxis.setAttribute('x',5);
  rectDateAxis.setAttribute('y',5 + xpAxisSize );
  rectDateAxis.setAttribute('width',dateAxisSize);
  rectDateAxis.setAttribute('height',2);
  rectDateAxis.setAttribute('fill','#000000');
  svg.appendChild(rectDateAxis);

  var rectXPAxis = document.createElementNS(svgNS,'rect');
  rectXPAxis.setAttribute('x',5 );
  rectXPAxis.setAttribute('y',5);
  rectXPAxis.setAttribute('width', 2);
  rectXPAxis.setAttribute('height',xpAxisSize);
  rectXPAxis.setAttribute('fill','#000000');
  svg.appendChild(rectXPAxis);

  console.log(valid_tx)
  
  var txList = []
  let tempTotal = 0
  let last_x = 5
  let last_y = dateAxisSize
   valid_tx.forEach((tx) => {
     tempTotal += tx.amount
      let _tT = tempTotal
      let _tx = document.createElementNS(svgNS,'circle');
      let xTaux = (new Date(tx.createdAt) - minimumDate) / (currentDate - minimumDate)
      let cx = (xTaux) * dateAxisSize + 5
      let cy = (tempTotal / totalXP) * -1 * xpAxisSize + dateAxisSize
      _tx.setAttribute('cx', cx)
      _tx.setAttribute('cy', cy)
      _tx.setAttribute('r', 2)
      _tx.addEventListener('mouseenter', () => {
       _tx.setAttribute('fill', 'red')
        document.getElementById("TXdetailsText").textContent = `${tx.createdAt}, xp amount: ${tx.amount}, total xp: ${_tT}`
       // display more information about the transaction (to be canceled in the next event listener)

     })
     _tx.addEventListener('mouseout', () => {
      document.getElementById("TXdetailsText").textContent
      _tx.setAttribute('fill', 'black')
    })
     
      let _line = document.createElementNS(svgNS, 'line')
      _line.setAttribute('x1', last_x)
      _line.setAttribute('y1', last_y)
      _line.setAttribute('x2', cx)
      _line.setAttribute('y2', cy)
      _line.setAttribute('stroke', 'black')

      

      last_x = cx
      last_y = cy
      txList.push(_tx)
      txList.push(_line)
   })
   console.log(txList)
   txList.forEach((txElem) => {
     svg.appendChild(txElem)
   })
   
   svg.id = nodeId
   return svg
} // return svg of our graph 

function createGraphRatio(data, axisWidth, nodeId) {

  var dictPiscines = {go: {fail: [], pass: []}, js: {fail: [], pass: []}, rust: {fail: [], pass: []}}
  data.data.result.forEach((r) => {
    console.log(r.path)
    let piscine
    if (r.path.startsWith("/rouen/piscine-go")) {
      if (r.grade == "1") {
        dictPiscines.go.pass.push(r)
      }else{
        dictPiscines.go.fail.push(r)
      }
    }
    if (r.path.startsWith("/rouen/div-01/piscine-js")) {
      if (r.grade == "1") {
        dictPiscines.js.pass.push(r)
      }else{
        dictPiscines.js.fail.push(r)
      }
    }
    if (r.path.startsWith("/rouen/div-01/piscine-rust")) {
      if (r.grade == "1") {
        dictPiscines.rust.pass.push(r)
      }else{
        dictPiscines.rust.fail.push(r)
      }
    }
      
  })
  



  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.height = `${200}px`
  svg.style.width = `${axisWidth + axisWidth * 0.5}px`
  svg.style.padding = "0px"
  svg.style.margin = "0px"
  var svgNS = svg.namespaceURI;

  var rectGo = document.createElementNS(svgNS,'rect');
  rectGo.setAttribute('x',30);
  rectGo.setAttribute('y',5);
  rectGo.setAttribute('width',axisWidth * (dictPiscines.go.pass.length / dictPiscines.go.fail.length));
  rectGo.setAttribute('height',4);
  rectGo.setAttribute('fill','#000000');
  svg.appendChild(rectGo);

  var rectJS = document.createElementNS(svgNS,'rect');
  rectJS.setAttribute('x',30);
  rectJS.setAttribute('y', 30);
  rectJS.setAttribute('width', axisWidth * (dictPiscines.js.pass.length / dictPiscines.js.fail.length));
  rectJS.setAttribute('height',4);
  rectJS.setAttribute('fill','#000000');
  svg.appendChild(rectJS);

  let wRust = axisWidth * (dictPiscines.rust.pass.length / dictPiscines.rust.fail.length)

  var rectRust = document.createElementNS(svgNS,'rect');
  rectRust.setAttribute('x',30);
  rectRust.setAttribute('y', 55);
  rectRust.setAttribute('width', isNaN(wRust) ? axisWidth : wRust);
  rectRust.setAttribute('height',4);
  rectRust.setAttribute('fill','#000000');
  svg.appendChild(rectRust);

  var rectEtalon = document.createElementNS(svgNS,'rect');
  rectEtalon.setAttribute('x',30);
  rectEtalon.setAttribute('y', 55 + 25);
  rectEtalon.setAttribute('width', axisWidth);
  rectEtalon.setAttribute('height',4);
  rectEtalon.setAttribute('fill','#606060');
  svg.appendChild(rectEtalon);





  var txtValueJS = document.createElementNS(svgNS, 'text')
  txtValueJS.setAttribute('font-family', 'Verdana')
  txtValueJS.setAttribute('font-size', '10')
  txtValueJS.setAttribute('x', 0)
  txtValueJS.setAttribute('y', 35)
  txtValueJS.textContent = "JS"
  svg.appendChild(txtValueJS)

  var txtValueGo = document.createElementNS(svgNS, 'text')
  txtValueGo.setAttribute('font-family', 'Verdana')
  txtValueGo.setAttribute('font-size', '10')
  txtValueGo.setAttribute('x', 0)
  txtValueGo.setAttribute('y', 10)
  txtValueGo.textContent = "Go"
  svg.appendChild(txtValueGo)



  var txtValueRust = document.createElementNS(svgNS, 'text')
  txtValueRust.setAttribute('font-family', 'Verdana')
  txtValueRust.setAttribute('font-size', '10')
  txtValueRust.setAttribute('x', 0)
  txtValueRust.setAttribute('y', 60)
  txtValueRust.textContent = "Rust"
 svg.appendChild(txtValueRust)





 var txtTxJS = document.createElementNS(svgNS, 'text')
 txtTxJS.setAttribute('font-family', 'Verdana')
 txtTxJS.setAttribute('font-size', '10')
 txtTxJS.setAttribute('x', axisWidth + 40)
 txtTxJS.setAttribute('y', 35)
 txtTxJS.textContent = `Taux: ${Math.round(dictPiscines.js.pass.length / dictPiscines.js.fail.length * 100) / 100}`
 svg.appendChild(txtTxJS)

 var txtTxGo = document.createElementNS(svgNS, 'text')
 txtTxGo.setAttribute('font-family', 'Verdana')
 txtTxGo.setAttribute('font-size', '10')
 txtTxGo.setAttribute('x', axisWidth + 40)
 txtTxGo.setAttribute('y', 10)
 txtTxGo.textContent = `Taux: ${Math.round((dictPiscines.go.pass.length / dictPiscines.go.fail.length)* 100) / 100}`
 svg.appendChild(txtTxGo)



 var txtTxRust = document.createElementNS(svgNS, 'text')
 txtTxRust.setAttribute('font-family', 'Verdana')
 txtTxRust.setAttribute('font-size', '10')
 txtTxRust.setAttribute('x', axisWidth + 40)
 txtTxRust.setAttribute('y', 60)
 txtTxRust.textContent = `Taux: ${isNaN(wRust) ? 1 : Math.round(wRust) / 100 }`
svg.appendChild(txtTxRust)
 


  svg.id = nodeId
  return svg
}
export function show_user_info(data) {
  

  const userData = data.data.user[0];
  console.log("🚀 ~ showUserInfo ~ userData:", userData);

 

  const currentDate = new Date();
  let minimumDate = new Date();
  let startXP = 0;
  minimumDate.setMonth(minimumDate.getMonth() - 6);
  let totalXP = 0;
  const validTx = data.data.transaction.filter((tx) => {
    const date = new Date(tx.createdAt);
    totalXP += tx.amount;
    if (date < minimumDate) startXP += tx.amount;
    return date >= minimumDate;
  });

  const details = document.createElement("p")
  details.id = "TXdetailsText"
  

  const stepHor = (currentDate - minimumDate) / 100;
  const stepVert = (totalXP - startXP) / 100;

  let currentXP = startXP;

  const points = validTx.reduce((accumulator, tx) => {
    const currentDate = new Date(tx.createdAt);
    let displacementX = (currentDate - minimumDate) / stepHor;
    let displacementY = (currentXP - startXP + tx.amount) / stepVert;
    let x = Math.floor((450 / 100) * displacementX);
    let y = Math.floor(210 - (210 / 100) * displacementY);
    currentXP += tx.amount;

    return `${accumulator}${x},${y} `;
  }, "");
  console.log("🚀 ~ points ~ points:", points);
  // Merci TheOldestBrother <3
  
  

  const section = document.createElement("section");
  section.id = "profile-section";
  section.classList.add("vh-100");
  section.style.backgroundColor = "#508bfc";

  const container = document.createElement("div");
  container.classList.add("container", "py-5", "h-100");

  const row = document.createElement("div");
  row.classList.add(
    "row",
    "justify-content-center",
    "align-items-center",
    "h-100"
  );

  const col = document.createElement("div");
  col.classList.add("col-md-8");

  const card = document.createElement("div");
  card.classList.add("card");

  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");
  cardHeader.innerHTML = "<h3>Profil Utilisateur</h3>";

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const nomLabel = document.createElement("label");
  nomLabel.textContent = "Nom:";
  nomLabel.style.paddingRight = "5px";
  const nomSpan = document.createElement("span");
  nomSpan.id = "nom";
  nomSpan.textContent = userData.lastName;

  const prenomLabel = document.createElement("label");
  prenomLabel.textContent = "Prénom:";
  prenomLabel.style.paddingRight = "5px";
  const prenomSpan = document.createElement("span");
  prenomSpan.id = "prenom";
  prenomSpan.textContent = userData.firstName;

  const pseudoLabel = document.createElement("label");
  pseudoLabel.textContent = "Pseudo:";
  pseudoLabel.style.paddingRight = "5px";
  const pseudoSpan = document.createElement("span");
  pseudoSpan.id = "pseudo";
  pseudoSpan.textContent = userData.login;

  const profileSection = document.createElement("div");
  profileSection.classList.add("profile-section");
  profileSection.innerHTML = `
  <h4>Informations complémentaires</h4>
  <p>Level: ${userData.events[0].level}</p>
  <p>Total XP: ${totalXP}</p>
`;

let d1 = new Date(data.data.transaction[0].createdAt)
let today = new Date()
// RESTART HERE ! -----------------------------------------------------------------------------

const inputRangeMonths = document.createElement("input")
inputRangeMonths.type = "range"
inputRangeMonths.max = String((today.getFullYear() - d1.getFullYear()) * 12 - d1.getMonth() + today.getMonth()) 
inputRangeMonths.min = "1"
inputRangeMonths.step = "1"
inputRangeMonths.addEventListener("input", () => {
  document.getElementById("graphXpTransaction").innerHTML =` ${createGraphXpTransactions(data, 200, 200, inputRangeMonths.value,"graphXpTransactionSVG").outerHTML}`  
  document.getElementById("titleGraphXp").textContent = ` Expérience au cour des ${inputRangeMonths.value} derniers mois `
})
  const graphSection = document.createElement("section")
  graphSection.classList.add("graph-section");
  graphSection.id = "graphSection"
  graphSection.innerHTML = `
<h4>Graphiques</h4>
<div class="text-center">

<h5 id="titleGraphXp"> Expérience au cour des ${inputRangeMonths.value} derniers mois </h5>
<div id="graphXpTransaction">
${createGraphXpTransactions(data, 200, 200, 12,"graphXpTransactionSVG").outerHTML}
</div>
<div id="inputRangeMonths">

</div>
</div>
<div class="text-center">
<h5> Taux de réussite des projets durants les différentes piscines </h5>
${createGraphRatio(data, 200, "graphRatioSVG").outerHTML}
</div>

`;
 

  const logoutButton = document.createElement("button");
  logoutButton.type = "button";
  logoutButton.classList.add("btn", "btn-primary");
  logoutButton.textContent = "Déconnexion";
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("user_login");
    window.location.reload();
  });

  document.body.appendChild(section);
  section.appendChild(container);
 // section.appendChild(userInfoContainer);
  container.appendChild(row);
  row.appendChild(col);
  col.appendChild(card);
  card.appendChild(cardHeader);
  card.appendChild(cardBody);
  cardBody.appendChild(nomLabel);
  cardBody.appendChild(nomSpan);
  cardBody.appendChild(document.createElement("br"));
  cardBody.appendChild(prenomLabel);
  cardBody.appendChild(prenomSpan);
  cardBody.appendChild(document.createElement("br"));
  cardBody.appendChild(pseudoLabel);
  cardBody.appendChild(pseudoSpan);
  cardBody.appendChild(profileSection);
  cardBody.appendChild(graphSection);
  document.getElementById("inputRangeMonths").appendChild(inputRangeMonths)
  cardBody.appendChild(logoutButton);
}


