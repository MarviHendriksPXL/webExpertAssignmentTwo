const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
    type: String,
        required: true,
        validate: {
            validator: function(value){
                return /^[a-zA-Z0-9,.?:!'\- ]+$/.test(value);
            },
            message: (props) => `${props.value} is not valid!`
        }
},
    date: { type: Date, default: Date.now },
    reactions: [{ type: String }]
},{ collection: "comments" });



module.exports = mongoose.model("Comment", messageSchema );


