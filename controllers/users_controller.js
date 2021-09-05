const Users = require("../models/users");

// users profile page
module.exports.profile = (req,res)=>{
	res.send("<h1> Profile Page </h1>");
}


// create a new user
module.exports.create = async (req,res)=>{
	let firstName = req.body.first_name;
	let lastName = req.body.last_name;
	let password = req.body.password;
	let email = req.body.email;
	let confirmPassword = req.body.confirm_password;
	let gender = req.body.gender;
	let dob = req.body.dob;

	if(!firstName || !lastName || !email || !password || !confirmPassword || !gender || !dob){
		
		return res.status(404).json({"error": "All Fields are required"});
	}

	// Password not Match
	if(password != confirmPassword){
		return res.status(404).json({"error":"Password are not Matching"});
	}

	let user = await Users.findOne({
		where:{email}
	});


	// if user already exist
	if(user)
		res.status(201).send("User Already exist");

	// TODO : store the hash password
	let newUser = await Users.create({
		firstName,
		lastName,
		email,
		password,
		gender,
		dob
	})

	// TODO : this user also include the password 
	// so we need to remove the password 
	return res.status(201).send(newUser);
}

