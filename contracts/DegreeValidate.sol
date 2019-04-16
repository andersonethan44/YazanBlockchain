pragma solidity ^0.4.24;



// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract DegreeValidate {
	struct StudentInfo {
    string major;
    string gradYear;
	uint index;
  	}

	mapping (address => StudentInfo) students;
	
  	address[] private userIndex;


	event PushExistingUser (address indexed userAddress, string major, string gradYear, uint index);
	event PushNewUser (address indexed userAddress, string major, string gradYear, uint index);

	constructor() public {
	
		
	}
	function isUser(address userAddress)
    public 
    constant
    returns(bool isIndeed) 
 	{
    	if(userIndex.length == 0) return false;
    	return (userIndex[students[userAddress].index] == userAddress);
  	}
	

	function updateUser(address user, string major, string gradYear) public returns(bool success){
		if (!isUser(user)) {
			newUser(user, major, gradYear);
		} 
		students[user].major = major;
		students[user].gradYear = gradYear;
		emit PushExistingUser(
			user,
			students[user].major,
			students[user].gradYear,
			students[user].index 
		);
		
		return true;
	}
	function newUser(address user, string major, string gradYear) public returns(bool success){
		
		students[user].major = major;
		students[user].gradYear = gradYear;
		students[user].index    = userIndex.push(user)-1;
		emit PushNewUser(
			user,
			students[user].major,
			students[user].gradYear,
			students[user].index 
		);
		
		return true;
	}

	

	function getUserMajor(address addr) public view returns(string major){
		return students[addr].major;

	}
	function getUserGradYear(address addr) public view returns(string gradYear){
		return students[addr].gradYear;

	}

	function getMaxIndex() public view returns (uint maxIndex){
		return userIndex.length;

	} 
	
}
