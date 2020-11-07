const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type:String,
        required: true
    },
    profilepic: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI7dZUPEfk39jJc24vD1LM8eW7NLKKRG0ny0Vf3Gk0bRb1O_cn&s"

    },
    gender:{
        type : String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String
    },
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "myPerson"
        }
    ],
    frequests: [
        {
            type: Schema.Types.ObjectId,
            ref: "myPerson"
        }
    ],
    fsent: [
        {
            type: Schema.Types.ObjectId,
            ref: "myPerson"
        }
    ],
    activeChats:[{
        type: Schema.Types.ObjectId,
        ref: 'chats'
    }],
    about: {
        dob: {
            type: String
        },
        city: {
            type: String
        },
        pEducation: {
            type: String
        },
        sEducation: {
            type: String
        },
        hEducation: {
            type: String
        }

    }
});

module.exports = mongoose.model("myPerson", PersonSchema);

