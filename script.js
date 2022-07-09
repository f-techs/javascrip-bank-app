'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Esther Asare',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Kojo Quansah',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Frank Quansah',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Hannah Assumang',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const transferError = document.querySelector('.transfer__error');
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//FUNCTIONS

//function to display movements
const displayMovement = (movementsArr)=>{
    //clear initial html content
    containerMovements.innerHTML='';

    //get data from array using foreach to run individual rows
    movementsArr.forEach((movement, index)=>{
        const movementType = movement > 0 ? 'deposit' : 'withdrawal';
        const htmlRow = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movementType}">${index + 1} ${movementType}</div>
        <div class="movements__date"></div>
        <div class="movements__value">${movement}€</div>
      </div>
        `;
        containerMovements.insertAdjacentHTML("afterbegin", htmlRow);
    })
}


// add username to accounts
const createUsername = (accountsArr)=>{
    accountsArr.forEach((account)=>{
    // split creats the full name into array then map changes all array initials 'at' get the first letter of the words and join changes it to string
    account.username = account.owner.toLowerCase().split(' ').map(name => name.at(0)).join('');
})
}

const calculateBalance = (account)=>{
 account.balance = account.movements.reduce((totalAmount, amounts)=> totalAmount+=amounts, 0);
 return labelBalance.textContent = `${account.balance} €`;
}

const calcTotalDeposits = (movementArr) => {
     const totalDeposit = movementArr.filter((amount)=> amount > 0).reduce((totalAmount, filteredAmounts)=>totalAmount+=filteredAmounts  , 0);
     return  labelSumIn.textContent = `${totalDeposit} €`;
}

const calcTotalWithdraw = (movementArr) => {
       const totalWithdraw =  Math.abs(movementArr.filter((amount)=> amount < 0).reduce((totalAmount, filteredAmounts)=>totalAmount+=filteredAmounts  , 0));
       return labelSumOut.textContent = `${totalWithdraw} €`;
}

const clearInputs = (InputArr)=>{
    InputArr.map((input)=> input.value = '');
}

const transferMoney = (transferAmount, recipientUsername)=>{
    transferError.style.display='none';
 const receiptAcc = accounts.find((account)=> account.username === recipientUsername);
 if(receiptAcc && transferAmount > 0 && transferAmount < currentAccount.balance && recipientUsername !== currentAccount.username){
    receiptAcc.movements?.push(Number(transferAmount));
    currentAccount.movements?.push(Number(-transferAmount));
 }else{
    transferError.textContent='Transfer error. Check amount and username well';
    transferError.style.display='block';
 }

}


//function to calculate loan transfer
const transferLoan = (loanAmount)=>{
 const checkLoanAmount= currentAccount.movements.find((amount) => {
    return amount > Number(loanAmount) * 0.1;
    })
    Boolean(checkLoanAmount) ? currentAccount.movements.push(Number(loanAmount)) : ''
}

const updateUI = (loggedInAccount)=>{
    //display transaction list
    displayMovement(loggedInAccount.movements);

    //display totalBalance
    calculateBalance(loggedInAccount);

    //display totalWithdrawal
    calcTotalDeposits(loggedInAccount.movements);

    //display totalDeposit
    calcTotalWithdraw(loggedInAccount.movements);

}





//createUsername(accounts);


///////////////////////
// USE OF THE FUNCTIONS
//////////////////////




//call function to add username to accounts

createUsername(accounts);

//Event Listeners
let currentAccount;
btnLogin.addEventListener('click', function(e){
e.preventDefault();
currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value);
if(currentAccount?.pin === Number(inputLoginPin.value)){
    //Display Welcome message
     labelWelcome.textContent = `Welcome, ${currentAccount?.owner.split(' ').at(0)}`;
     labelWelcome.style.color = 'black';

    //Display interface
     containerApp.style.opacity = 100;

     //update UI
     updateUI(currentAccount);
    
     //clearInputs
     clearInputs([inputLoginUsername, inputLoginPin]);
     inputLoginPin.blur();

     
    //console.log(currentAccount.movements);
}else{
    labelWelcome.textContent = `Sorry Wrong Credentials!`; 
    labelWelcome.style.color = '#ff3333';
}


})


btnTransfer.addEventListener('click', (e)=>{
    e.preventDefault();

    //call transferMoney function
    transferMoney(inputTransferAmount.value, inputTransferTo.value);

    //update UI
    updateUI(currentAccount);

    //clear Text Boxes
    clearInputs([inputTransferAmount, inputTransferTo]);
})

btnLoan.addEventListener('click', (e)=>{
    e.preventDefault();

    //call Loan transfer function
    transferLoan(inputLoanAmount.value);
     
    updateUI(currentAccount);
    //clear Text Boxes
    clearInputs([inputLoanAmount]);
})
//console.log(accounts)

