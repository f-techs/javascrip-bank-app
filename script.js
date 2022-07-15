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
const inputNewUsername = document.querySelector('.login__input--username');
const inputUserPass = document.querySelector('.set__input--pass');
const inputUserPassConfirm = document.querySelector('.set__input--pass--confirm');
const inputClosePin = document.querySelector('.form__input--pin');
const transferError = document.querySelector('.transfer__error');
const loanError = document.querySelector('.loan__error');
const loginError = document.querySelector('.login-error');
const registerError = document.querySelector('.register-error');
const btnRegister = document.querySelector('.register__btn');
const RegisterPage = document.querySelector('.register__box');
const LoginPage = document.querySelector('.login__box');
const btnRegisterUser = document.querySelector('.register__new__btn');
const logOut = document.querySelector('.logout');
const btnAbout = document.querySelector('.show-about-app');
const aboutModal = document.querySelector('.about-app');
const btnCloseModal = document.querySelector('.close-modal');

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
const displayMovement = (movementsArr, sort = false)=>{
    //clear initial html content
    containerMovements.innerHTML='';

    //get data from array using foreach to run individual rows

    const amountMovementsSort = sort ? movementsArr.slice().sort((a,b)=> a-b ) : movementsArr;
    amountMovementsSort.forEach((movement, index)=>{
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

const createNewAccount = (userName, userPassword, interest=1.5, movements=[200])=>{
    return {
        owner: userName,
        movements: movements,
        interestRate: interest, // %
        pin: userPassword,
      };
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
    !receiptAcc ? transferError.textContent='Receipient username not in the system':'';
    transferAmount <=0 ? transferError.textContent=`Sorry you can't transfer less than 0 or 0 amount`:'';
    transferAmount > currentAccount.balance ? transferError.textContent=`Sorry amount exceeds balance` : '';
    recipientUsername.value === currentAccount.username ? transferError.textContent=`You can't transfer to your own account` : '';
    transferError.style.display='block';
 }

}


//function to calculate loan transfer
const transferLoan = (loanAmount)=>{
    const Amount = Number(loanAmount);
    if(Amount > 0 && currentAccount.movements.some(accountDeposit => accountDeposit >= Amount * 0.1)){
    loanError.style.display='none';
     loanError.textContent='';
     currentAccount.movements.push(Amount);
    }else{
    Amount <= 0 ?  loanError.textContent=`Loan Amount can't be 0 or less than 0` : '';
    !currentAccount.movements.some(accountDeposit => accountDeposit >= Amount * 0.1) ? loanError.textContent=`No deposit greater than 10% of Loan` : '';
    loanError.style.display='block';
    }
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
btnAbout.addEventListener('click', ()=>{
  aboutModal.style.display='flex';
})

btnCloseModal.addEventListener('click', ()=>{
  aboutModal.style.display='none';
})

btnRegister.addEventListener('click', (e)=>{
e.preventDefault();
RegisterPage.style.display = 'block';
LoginPage.style.display='none';

})

btnRegisterUser.addEventListener('click', (e)=>{
e.preventDefault();
const pass = Number(inputUserPass.value);
const passConfirm = Number(inputUserPassConfirm.value);
const checkUsername = accounts.some((acc)=>acc.username === inputNewUsername.value.toLowerCase().split(' ').map(name => name.at(0)).join(''));
console.log(checkUsername);
if(!checkUsername && inputNewUsername.value !== '' && inputUserPass.value !== '' && inputUserPassConfirm.value !== '' && pass === passConfirm){
const newAcc = createNewAccount(inputNewUsername.value, passConfirm, undefined, undefined);
accounts.push(newAcc);
createUsername(accounts);
console.log(accounts)
RegisterPage.style.display='none';
LoginPage.style.display='block';
loginError.textContent='Successful. Login';
loginError.style.color='green';
clearInputs([inputNewUsername, inputUserPassConfirm, inputUserPass]);
}else{
inputNewUsername.value === '' ? inputNewUsername.classList.add('error-border') : '';
inputUserPass.value === '' ? inputUserPass.classList.add('error-border') : '';
inputUserPassConfirm.value === '' ? inputUserPassConfirm.classList.add('error-border') : '';
pass !== passConfirm  ? registerError.textContent=`Password Mismatch`:'';
checkUsername ? registerError.textContent=`Username Exist`:'';
registerError.style.display='block';
}

})



//call function to add username to accounts

createUsername(accounts);

//Event Listeners
let currentAccount;
btnLogin.addEventListener('click', function(e){
e.preventDefault();
const username = inputLoginUsername.value.toLowerCase();
currentAccount = accounts.find((acc) => acc.username === username);
if(currentAccount?.pin === Number(inputLoginPin.value) && inputLoginUsername.value !== '' && inputLoginPin.value !== ''){
    //Display Welcome message
     labelWelcome.textContent = `Welcome, ${currentAccount?.owner.split(' ').at(0)}`;
    //  labelWelcome.style.display='none';
    LoginPage.style.display = 'none';

    //Display interface
     containerApp.style.opacity = 100;

     //update UI
     updateUI(currentAccount);
    
     //clearInputs
     clearInputs([inputLoginUsername, inputLoginPin]);
     inputLoginPin.blur();

     
    //console.log(currentAccount.movements);
}else{
    currentAccount ? loginError.textContent = `Wrong username!` : ''; 
    currentAccount?.pin !== Number(inputLoginPin.value) ?  loginError.textContent = `Wrong Password!` : ''; 
    inputLoginUsername.value === '' || inputLoginPin.value === '' ? loginError.textContent = `All fields are required` : ''; 
    loginError.style.display='block';

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

btnClose.addEventListener('click', (e)=>{
e.preventDefault();
if(currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)){
    const delAccountIndex = accounts.findIndex((acc)=>{
        return acc.username === currentAccount.username
    });
   //accounts.splice(delAccountIndex, 1);
   containerApp.style.opacity=0;
   LoginPage.style.display = 'block';
  //  labelWelcome.textContent=`Log in to get started`;
}else{
    clearInputs([inputCloseUsername, inputClosePin])
}

})
// sort deposits and withdrawal
let sorted = false;
btnSort.addEventListener('click', ()=>{
    displayMovement(currentAccount.movements, !sorted);
    sorted = !sorted;
})



// let newAccount;
// newAccount=`account${accounts.length}`;
// newAccount = createObject('Adjei Quansah', [200, 300], 1, 5555);
// accounts.push(newAccount);
// console.log(accounts);