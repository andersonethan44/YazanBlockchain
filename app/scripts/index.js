
// Developed using truffle web pack and web3

import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'


import DegreeValidateArtifact from '../../build/contracts/DegreeValidate.json'


const DegreeValidate = contract(DegreeValidateArtifact)


let accounts
let account
var accountNum 
var validYears = ["2016","2017","2018"];
var validMajors = ["math","english","history"];

const ecies = require("eth-ecies");


const App = {
  start: function () {
    const self = this

  
    DegreeValidate.setProvider(web3.currentProvider)

  
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      accountNum = 0
      account = accounts[0]
      const addressElement = document.getElementById('address')
      addressElement.innerHTML = account;
      console.log('Account Number is ');
      console.log(accounts.length);
      self.refreshMajor()
      self.refreshYear()
      self.getUserCount()
     
  
     
     // self.queryDB()
      const majorelement = document.getElementById('gradMajor')
      var majorHTML = "<select>\n";
      for (var i = 0; i < validMajors.length; i++){
        majorHTML = majorHTML + "<option value='"+validMajors[i]+"'>" + validMajors[i] + "</option>\n"

      }
      majorHTML = majorHTML + "</select>"
      console.log(majorHTML);
      majorelement.innerHTML = majorHTML;

      const yearelement = document.getElementById('gradYear')
      var yearHTML = "<select>\n";
      for (var i = 0; i < validYears.length; i++){
        yearHTML = yearHTML + "<option value='"+validYears[i]+"'>" + validYears[i] + "</option>\n"

      }
      yearHTML = yearHTML + "</select>"
      console.log(yearHTML);
      yearelement.innerHTML = yearHTML;

    })
  },
  encryptMessage: function(publicKey, message){
    // Adapted from Example https://github.com/LimelabsTech/eth-ecies

    let userPublicKey = new Buffer(publicKey, 'hex');
    let bufferData = new Buffer(message);

    let encryptedData = ecies.encrypt(userPublicKey, bufferData);
    return encryptedData.toString('base64');

  },
  decryptMessage: function(privateKey, message){
    // Adapted from Example https://github.com/LimelabsTech/eth-ecies
    let userPrivateKey = new Buffer(privateKey, 'hex');
    let bufferEncryptedData = new Buffer(message, 'base64');

    let decryptedData = ecies.decrypt(userPrivateKey, bufferEncryptedData);
    
    return decryptedData.toString('utf8');

  },
  testEncryptMessage: function (){

    

    var message = document.getElementById('toEncrypt').value;
    console.log(document.getElementById('toEncrypt').value);
   
    const publicKey = 'e0d262b939cd0267cfbe3f004e2863d41d1f631ce33701a8920ba73925189f5d15be92cea3c58987aa47ca70216182ba6bd89026fc15edfe2092a66f59a14003';
    const privateKey = '55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690';

    const data = message;

    let userPublicKey = new Buffer(publicKey, 'hex');
    let bufferData = new Buffer(data);

    let encryptedData = ecies.encrypt(userPublicKey, bufferData);


    const encryptElement = document.getElementById('encryptedMessage');
    encryptElement.innerHTML = encryptedData.toString('hex');
    console.log(encryptedData.toString('hex'));
    

    let userPrivateKey = new Buffer(privateKey, 'hex');
    let bufferEncryptedData = new Buffer(encryptedData, 'base64');

    let decryptedData = ecies.decrypt(userPrivateKey, bufferEncryptedData);
    const decryptElement = document.getElementById('decryptedMessage');
    decryptElement.innerHTML = decryptedData.toString('utf8');
    
    console.log(decryptedData.toString('utf8'));

    return encryptedData.toString('base64');
    

  },
  insertDB: function (major, gradyear, address) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://api.mongolab.com/api/1/databases/studentinfo/collections/profile?u=true&apiKey=lep1lEx56-2adaRmyMgGU-7vuVCZiAv4", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send("{'major' : '"+ major + "', 'gradyear' : '"+gradyear+"', 'address' : '"+address+"'}");
  
  },
  queryDB: function (major, gradyear) {
    var xhr = new XMLHttpRequest();
    var url = "https://api.mongolab.com/api/1/databases/studentinfo/collections/profile?&q={%22gradyear%22:%20%22"+
    gradyear.toString()+
    "%22}&"+
    "q={%major%22:%20%22"+
    major.toString()+
    "%22}&"+
    "fo=true&apiKey=lep1lEx56-2adaRmyMgGU-7vuVCZiAv4";
    console.log(url);
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function (){
        console.log(xhr.responseText);
        if (xhr.responseText.toString().includes("null")){

          console.log("User not Found");
        }
        else {
          console.log("User Found");
        }
    }
    xhr.send(null);
  
  },
  
  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },
  refreshMajor: function () {
    const self = this

    let degree
    DegreeValidate.deployed().then(function (instance) {
      degree = instance

      return degree.getUserMajor.call(account, { from: account })
    }).then(function (value) {
      const majorElement = document.getElementById('major')
      var majorVal = self.decryptMessage('55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690',value); 
      majorElement.innerHTML = majorVal;

      const majorEncryptedElement = document.getElementById('majorEncrypted')
      majorEncryptedElement.innerHTML = value;

      const nameElement = document.getElementById("nameOutput")
      nameElement.innerHTML = document.getElementById("nameInput").value
      
      console.log("name updated")
      
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting Major; see log.')
    })

  },
  refreshYear: function () {
    const self = this

    let degree
    DegreeValidate.deployed().then(function (instance) {
      degree = instance

      return degree.getUserGradYear.call(account, { from: account })
    }).then(function (value) {
      const yearElement = document.getElementById('year')
      var yearVal = self.decryptMessage('55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690',value);
      yearElement.innerHTML = yearVal;
      const yearEncryptedElement = document.getElementById('yearEncrypted')
      var yearEncryptedVal = self.decryptMessage('55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690',value);
      yearEncryptedElement.innerHTML = value;
      
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting Year; see log.')
    })

  },
  getUserCount: function () {
    const self = this

    let degree
    DegreeValidate.deployed().then(function (instance) {
      degree = instance

      return degree.getMaxIndex.call({ from: account })
    }).then(function (value) {
      const userCountElement = document.getElementById('userCount')
      userCountElement.innerHTML = value.valueOf()
      
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting Year; see log.')
    })

  },
  updateUser: function () {
    const self = this

    const gradMajor = document.getElementById('gradMajor')
    var majorSelected = gradMajor.options[gradMajor.selectedIndex].value
    const gradYear = document.getElementById('gradYear')
    var gradYearSelected =  gradYear.options[gradYear.selectedIndex].value
    this.setStatus('Initiating Profile Update... (please wait)')

    let degree
    DegreeValidate.deployed().then(function (instance) {
      degree = instance
      console.log(majorSelected)
      self.queryDB(majorSelected,gradYearSelected,null);
      self.insertDB(majorSelected, gradYearSelected, account);
      majorSelected = self.encryptMessage('e0d262b939cd0267cfbe3f004e2863d41d1f631ce33701a8920ba73925189f5d15be92cea3c58987aa47ca70216182ba6bd89026fc15edfe2092a66f59a14003',majorSelected);
      gradYearSelected = self.encryptMessage('e0d262b939cd0267cfbe3f004e2863d41d1f631ce33701a8920ba73925189f5d15be92cea3c58987aa47ca70216182ba6bd89026fc15edfe2092a66f59a14003',gradYearSelected);
      //console.log(self.encryptMessage('e0d262b939cd0267cfbe3f004e2863d41d1f631ce33701a8920ba73925189f5d15be92cea3c58987aa47ca70216182ba6bd89026fc15edfe2092a66f59a14003',majorSelected));
      return degree.updateUser(account, majorSelected, gradYearSelected, { from: account , gas: 3000000})
    }).then(function () {
      self.setStatus('Profile Update complete!')
   
      self.refreshMajor()
      self.refreshYear()
      self.getUserCount()
      
      
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error Updating User Profile; see log.')
    })
  },
  changeUser: function () {
    const self = this
    const accountNumElement = document.getElementById('account')
    accountNum = accountNumElement.value
    console.log(accountNum)
    accountNum = parseInt(accountNum)
    console.log(accountNum);
    account = accounts[accountNum];
    console.log(account);
    const addressElement = document.getElementById('address')
    addressElement.innerHTML = account
   
    
    self.refreshMajor()
    self.refreshYear()
    self.getUserCount()
  }
  
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 DegreeValidate,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
