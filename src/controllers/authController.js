/** @format */
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusMessage } = require("../utils/statusMessage");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const signup = async (req, res) => {
	/* 	#swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to signup a specific user' */
	console.log(req.body);
	const { fullname, username, password, confirmPassword, email } = req.body;
	console.log(fullname);
	if (
		fullname == null ||
		username == null ||
		password == null ||
		email == null ||
		confirmPassword == null ||
		fullname.length === 0 ||
		username.length === 0 ||
		email.length === 0 ||
		password.length === 0 ||
		confirmPassword.length === 0
	) {
		return res.status(StatusCodes.NO_CONTENT).json({ message: "Please Provide Fullname, username, password and confirm password" });
	}

	try {
		const user = await User.findOne({ username });
		if (user) {
			return res.status(400).json({ message: StatusMessage.USER_ALREADY_EXISTS });
		}

		if (password === confirmPassword) {
			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = new User({
				fullname,
				username,
				password: hashedPassword,
				email,
				created: Date.now(),
			});

			await newUser.save();
			res.status(201).json({ message: StatusMessage.SUCCESS });
		} else {
			res.status(401).json({ message: StatusMessage.INVALID_CREDENTIALS });
		}
	} catch (error) {
		res.status(500).json({ error: StatusMessage.INTERNAL_SERVER_ERROR });
	}
};

const signin = async (req, res) => {
	/* 	#swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to signin a specific user' */
	const { username, password } = req.body;
	try {
		const response = await findUserWithPassword(username, password);
		await validateResponse(response, res);
	} catch (error) {
		res.status(500).json({ error: StatusMessage.INTERNAL_SERVER_ERROR });
	}
};

const findUserWithPassword = async (username, password) => {
	const user = await User.findOne({ username });


	if (user) {
		const isValidPassword = await bcrypt.compare(password, user.password);
		// Reset login attempts on successful login
		return user;
	}
	return false;
};

const setCookies = (res, token) => {
	// Set the token as a cookie
	res.cookie("accesstoken", token, {
		httpOnly: true,
		// Add other cookie options as needed
	});
};

const validateResponse = (result, res) => {
	if (result instanceof User) {
			const token = jwt.sign({ userId: result._id }, process.env.JWT_SECRET, {
				expiresIn: 20000000,
			});
			setCookies(res, token);
			res.status(200).json({ message: StatusMessage.SUCCESS, token });
	} else {
		return res.status(401).json({ error: StatusMessage.INVALID_CREDENTIALS });
	}
};

const simpleUserauthentication = async (username, password) => {
	const user = await User.findOne({ username });

	if (user) {
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (isValidPassword) {
			return true;
		}
	}

	return false;
};

const verify = async (req, res) => {
	/* #swagger.ignore = true */
	const { token } = req.query;
	try {
		const decoded = await verifyToken(token);
		// If verification is successful, you can perform additional actions here
		res.json({ message: "Verification successful", user: decoded });
	} catch (error) {
		res.status(401).json({ error: "Invalid or expired token" });
	}
};

module.exports = { signin, signup, simpleUserauthentication, findUserWithPassword, verify };
