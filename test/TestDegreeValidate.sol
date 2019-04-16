pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DegreeValidate.sol";

contract TestDegreeValidate {

   function testCreateNewUser() public {
    DegreeValidate degree = DegreeValidate(DeployedAddresses.DegreeValidate());
    //log1( bytes32(msg.gas));
    degree.updateUser( tx.origin, "math", "2018");
    Assert.equal(degree.isUser(tx.origin), true, "Function should create a user");
    Assert.equal(degree.getMaxIndex(),1,"There should be one user");
    Assert.equal(degree.getUserMajor(tx.origin), "math","the major should be math");
    Assert.equal(degree.getUserGradYear(tx.origin), "2018","the year should be 2018");
  }
   function testUpdateExistingUser() public {
    DegreeValidate degree = DegreeValidate(DeployedAddresses.DegreeValidate());
    degree.updateUser( tx.origin, "math", "2018");
    degree.updateUser( tx.origin, "english", "2019");
    Assert.equal(degree.isUser(tx.origin), true, "Function should create a user");
    Assert.equal(degree.getUserMajor(tx.origin), "english","the major should be english");
    Assert.equal(degree.getUserGradYear(tx.origin), "2019","the year should be 2019");
  }
  
 

  
  

}
