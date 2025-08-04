// change in drawer
let cid = [
  ['PENNY', 2],
  ['NICKEL', 2],
  ['DIME', 2],
  ['QUARTER', 5],
  ['ONE', 100],
  ['FIVE', 100],
  ['TEN', 100],
  ['TWENTY', 200],
  ['ONE HUNDRED', 500]
];
// DOM variables
const cash = document.getElementById('cash');
const changeDue = document.getElementById('change-due');
const remain = document.getElementById('remains');
const purchaseBtn = document.getElementById('purchase-btn');
const total = document.getElementById('total');
const amount = document.querySelectorAll('.amount');
const imgContainer = document.querySelectorAll('.img-container img');
const cidContainer = document.getElementById('cid-container');
const changeInDrawer = document.getElementById('change-in-drawer');
const open = document.getElementById('open');
const nextTotal = document.getElementById('next');

// amount of units in the cash drawer
for(let i = 0; i < 9; i++){
  if(cid[8 - i][1] === 0) imgContainer[i].style.display = 'none';
  amount[i].textContent = `$${cid[8 - i][1]}`
}

// generate a random price
let price = Number((Math.random() * 100).toFixed(2));
total.textContent = `Total: ${price}`;

// purchase click event
purchaseBtn.addEventListener('click', ()=>{
  changeDue.innerText = '';
  const cashVal = Number(cash.value);
  nextTotal.style.display = 'block';

  // customer provides too little cash
  if(cashVal < price){
    alert("Customer does not have enough money to purchase the item");
    return;
  }
  // customer pays with the exact total amount
  if(cashVal === price){
    changeDue.innerText = "No change due - customer paid with exact cash";
    return;
  }
  // slide animation
  drawerSlide('visible', '9.3rem');

  let fund = cid.reduce((acc, currVal)=> acc + currVal[1], 0);
  const remaining = (cashVal - price).toFixed(2);

  // cash drawer doesn't have enough to issue the correct change
  remains.textContent = 'Change due: $'+remaining;
  if(fund < Number(remaining)){ 
    changeDue.innerText = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  const chg = change(remaining);
  // cash drawer doesn't have some units to issue the correct change
  if(!subtractCid(chg)) {
    changeDue.innerText = "Status: INSUFFICIENT_FUNDS";
    return;
  }
  fund = cid.reduce((acc, currVal) => acc + currVal[1], 0);
  if(fund === 0) changeDue.innerText = "Status: CLOSED\n\n";
  else changeDue.innerText = "Status: OPEN\n\n";
  chg.forEach(c => {
    if(c[1] !== 0) changeDue.innerText += ` ${c[0]}: $${c[1]}\n`
  });
  
  cash.value = '';
});

// next customer click event
next.addEventListener('click', ()=>{
  price = (Math.random() * 100).toFixed(2);
  total.textContent = `Total: ${price}`;
  drawerSlide('hidden', '-.2rem');
  nextTotal.style.display = 'none';
});
// open the cash drawer
open.addEventListener('click', ()=>{
  drawerSlide('visible', '9.3rem')
});

// function that turns the change due into units
function change(str){
  const under = str.split('.')[1];
  const above = str.split('.')[0];
  const underDollar=[
    {unit: "QUARTER", amount: 25},
    {unit: "DIME", amount: 10},
    {unit: "NICKEL", amount: 5},
    {unit: "PENNY", amount: 1},
  ];
  const aboveDollar=[
    {unit: "ONE HUNDRED", amount: 100},
    {unit: "TWENTY", amount: 20},
    {unit: "TEN", amount: 10},
    {unit: "FIVE", amount: 5},
    {unit: "ONE", amount: 1},
  ];
  return [
    ...changeUnits(above, aboveDollar),
    ...changeUnits(under, underDollar, .01)
  ];
}

// subtract the change due from the cash drawer
function subtractCid(chg, drawer = cid.reverse(), container = amount, img = imgContainer){
  let isEnough = true;

  for(let i = 0; i < 9; i++){
    const c = Number((chg[i][1] - drawer[i][1]).toFixed(2));
    if(c > 0){
      chg[i][1] = drawer[i][1];
      drawer[i][1] = 0;
      if(i < 8) chg[i+1][1] += c;
      else isEnough = false;
    }else{
      drawer[i][1] = (-1) * c;
    }
  }
  if(!isEnough){
    return false;
  }
  for(let i = 0; i < 9; i++){
    if(drawer[i][1] === 0) img[i].style.display = 'none';
    container[i].textContent = `$${drawer[i][1]}`;
  };
  return drawer.reverse();
}

// turns a number into an array of units
function changeUnits(num, currencies, divider = 1){
  let change = [];
  currencies.forEach(currency=>{
    let c = 0;
    if(num >= currency.amount){
      if(num % currency.amount === 0) c = num;
      else c = Math.floor(num / currency.amount) * currency.amount;
      num -= c;
    }
    change.push([currency.unit, c * divider]);
  });
  return change;
}

// function that runs the slide animation
function drawerSlide(overflow, top, container = cidContainer, drawer = changeInDrawer){
  container.style.overflow = overflow;
  drawer.style.top = top;
  drawer.style.transition = '1s ease 0ms';
}
