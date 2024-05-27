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
  svg.style.height = "500px"
  svg.style.width = "500px"
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
  svg.style.height = "500px"
  svg.style.width = "500px"
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
 


  svg.id = nodeId
  return svg
}
export function show_user_info(data) {
  //header
  const header_cont = document.createElement("div")
  const title = document.createElement("h1")
  title.textContent = `Welcome ${data.data.user[0].firstName} ${data.data.user[0].lastName}`;
  header_cont.appendChild(title);
  document.body.appendChild(header_cont)
  //boutton log-out
  const logout_button = document.createElement("button")
  logout_button.textContent = "Log out"
  document.body.appendChild(logout_button);
  logout_button.addEventListener("click", () => {
    localStorage.removeItem("user_login");
    window.location.reload();
  });

  var levelIndicator = document.createElement("p")
  console.log(data.data)
  levelIndicator.textContent = `Your current level: ${data.data.user[0].events[0].level}`
  document.body.appendChild(levelIndicator)

  const divGraphXpTransactions = document.createElement("div") 
  divGraphXpTransactions.id = "divGraphXpTransactions"
  document.body.appendChild(divGraphXpTransactions)

  let d1 = new Date(data.data.transaction[0].createdAt)
  let today = new Date()
  
  const displayRangeActualValue = document.createElement("p")
  displayRangeActualValue.textContent = `current month displayed: ${12} Months`

  const details = document.createElement("p")
  details.id = "TXdetailsText"
  
  const inputRangeMonths = document.createElement("input")
  inputRangeMonths.type = "range"
  inputRangeMonths.max = String((today.getFullYear() - d1.getFullYear()) * 12 - d1.getMonth() + today.getMonth()) 
  inputRangeMonths.min = "1"
  inputRangeMonths.step = "1"
  
  divGraphXpTransactions.appendChild(inputRangeMonths)
  divGraphXpTransactions.appendChild(displayRangeActualValue)
  divGraphXpTransactions.appendChild(details)
  // // SVG ----------

   const dateAxisSize = 300
   const xpAxisSize = 300
  
   divGraphXpTransactions.appendChild(createGraphXpTransactions(data, dateAxisSize, xpAxisSize, inputRangeMonths.value, "svgGraphXpTransactions"));
  
   inputRangeMonths.addEventListener('input', () => {
    displayRangeActualValue.textContent = `current month displayed: ${inputRangeMonths.value} Months`
    let HeredivGraphXpTransactions = document.getElementById("divGraphXpTransactions")
    document.getElementById("svgGraphXpTransactions").remove()

    HeredivGraphXpTransactions.appendChild(createGraphXpTransactions(data, dateAxisSize, xpAxisSize, inputRangeMonths.value, "svgGraphXpTransactions"))
    
  })
  let divGraphPassRatio = document.createElement("div")
  divGraphPassRatio.appendChild(createGraphRatio(data, 200, "node1D"))
  document.body.appendChild(divGraphPassRatio)

  // affichage des données récupérés
    const data_container = document.createElement("div");
    data_container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    document.body.appendChild(data_container);
  }
