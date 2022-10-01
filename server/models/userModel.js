const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is mandatory!!!"]
    },
    username: {
        type: String,
        unique:true,
        required: [true, "username is mandatory!!!"]
    },
    password: {
        type: String,
        validate:{
            validator: (value)=>value.length>=8,
            message: props => `Password should be atleast 8 characters long`
        },
        required: [true, "password is mandatory!!!"]
    }
});

userSchema.statics.signup = async (req, res, next) => {
    const user = req.body;
    try {
        const data = await UserModel.create(user);
        if (data) {
            console.log(data);
            res.status(201);
            res.send(`User ${data.username} created successfully!!!`);
        }
    } catch (error) {
        next(error);
        // console.log(error);
        // res.status(500);
        // res.send(error.message);
    }
};

userSchema.statics.login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const data = await UserModel.findOne({ username },{_id:0,__v:0});
        console.log(data);
        if (data) {
            // user exists
            if (password === data.password) {
                // user is authenticated successfully!!!
                res.send({ success: true, data:{username:data.username,name:data.name}, message: `${username} logged in successfully!!` });
            } else {
                const err = new Error("Incorrect Password!!!");
                err.status = 403;
                throw(err);
                // incorrect password
                // res.status(403);
                // res.send({ success: false, data: null, message: "Incorrect Password!!!" });
            }
        } else {
            const err = new Error("user does not exist!!!");
            err.status = 404;
            throw(err);
            // res.status(404);
            // res.send({ success: false, data: null, message: "user does not exist!!!" });
        }
    } catch (error) {
        next(error);
        // res.send({success:false,data:null,message:error.message});
    }
    
}

// UserModel we're going to use for interacting with db
const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;