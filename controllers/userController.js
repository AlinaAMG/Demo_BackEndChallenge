const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const renderWelcomePage = async (req, res) => {
  const token = req.cookies.userToken;

  if (!token) {
    return res.redirect('/user/login');
  }

  jwt.verify(token, 'User is jwt now', async (err, decoded) => {
    if (err) {
      console.log('Invalid token');
      return res.redirect('/user/login');
    }

    // Find the user using the decoded email
    UserModel.findOne({ email: decoded.email })
      .then((user) => {
        return UserModel.find()
          .then((messages) => {
            res.render('welcomePage', {
              userName: user.firstName,
              userLogged: user,
            });
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error retrieving messages');
      });
  });
};

const renderSignupLoginPage = (req, res) => {
  res.render('signUpLogin', {
    title: 'SignUp Login Registration',
    userMsg: '',
    passw: '',
    message: '',
    msg: '',
    msgPass: '',
    messageM: "",
    result:"",
  });
};


const signup = async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
    return res.status(404).render('signUpLogin', {
      message: 'All fields are required!',
      msg: '',
      result: '',
      res: '',
      msgPass: '',
      passw: '',
      userMsg: '',
      messageM: "",
    });
  }

  // check if the user exists
  
  //  Validate passwords
    if (password !== confirmPassword) {
      return res.render('signUpLogin', {
        msgPass: 'Passwords do not match.Please Try again!',
        userMsg: '',
        passw: '',
        message: '',
        msg: '',
        result: '',
        res: '',
        messageM:"",
      });
    }
    

    // validate name length
  if (firstName.length > 10 || lastName.length > 15) {
    return res.status(404).render('signUpLogin', {
      msg: 'First Name should be less than 10 characters and Last Name less than 15 characters',
      result: '',
      message: '',
      res: '',
      msgPass: '',
      passw: '',
      userMsg: '',
      messageM:"",
    });
  }
  // Check if the user already exists

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(404).render('signUpLogin', {
        userMsg: 'User already exists.Please log in.',
        msgPass: "",
        passw: '',
        message: '',
        msg: '',
        result: '',
        res: '',
        messageM:"",
      });
    }

    // 🔹 Hash password and save user
    let hashedPass = await bcrypt.hash(password, 10);
    let newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPass,
    });

  

    await newUser.save();

    return res.status(201).render('signUpLogin', {
      result: 'User is signed up. You can log in.',
      message: '',
      msg: '',
      res: '',
      msgPass: '',
      passw: '',
      userMsg: '',
      messageM:"",
    });

  } catch (err) {
    console.error('Sign up error:', err.message);
    return res.status(500).render('signUpLogin', {
      res: 'Something went wrong. User is not signed up! Please try again!',
      result: '',
      message: '',
      msg: '',
      msgPass: '',
      passw: '',
      userMsg: '',
      messageM:"",
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    // Check if email and password exist
    if (!email || !password) {
      return res.render('signUpLogin', {
        messageM: 'Email and password are required.',
        res: '',
        result: '',
        msg: '',
        msgPass: '',
        passw: '',
        userMsg: '',
        message:"",
      });
    }

    // Find user in database
    const existUser = await UserModel.findOne({ email });

    if (!existUser) {
      return res.render('signUpLogin', {
        res: '',
        result: '',
        message: '',
        msg: '',
        msgPass: '',
        passw: '',
        userMsg: 'User not found. Please sign up first...',
        messageM:"",
      });
    }

    // Check if password is correct
    const isCorrectPassword = await bcrypt.compare(password, existUser.password);

    if (!isCorrectPassword) {
      return res.render('signUpLogin', {
        res: '',
        result: '',
        message: 'Password or email is not correct. Please try again!',
        msg: '',
        msgPass: '',
        passw: '',
        userMsg: '',
        messageM:"",
      });
    }

    // Generate JWT Token
    const userToken = jwt.sign(
      { userId: existUser._id, email: existUser.email },
      "User is jwt now"
    );

    console.log('User token:', userToken);

    // Set cookie and redirect
    res.cookie('userToken', userToken);
    res.redirect('/welcome');
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).render('signUpLogin', {
      message: 'Something went wrong. Please try again!',
      res: '',
      result: '',
      msg: '',
      msgPass: '',
      passw: '',
      userMsg: '',
      messageM:"",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("userToken");
   res.redirect("/"); // Redirect to homepage or login page
  
 
}



const notFoundPage = (req, res) => {
  res.status(404).render('404', { title: '404' });
};

module.exports = {
  renderSignupLoginPage,
  signup,
  login,
  renderWelcomePage,
  logout,
  notFoundPage,
};
