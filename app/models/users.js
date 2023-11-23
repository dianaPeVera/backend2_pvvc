const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        id:{
            type:Number
        },
        name:{
            type:String
        },
        rol:{
            type:String
        },
        email:{
            type:String
        },
        password:{
            type:String
        },
        assignedTo: {
            type: [
                {
                    type: String,
                }
            ],
        },
    }, 
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('users', UserSchema);