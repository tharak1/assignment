import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please provide a name"],  
    },
    dob:{
        type: Date,
        required: [true, "Please provide dob"],  
    },
})

const Data = mongoose.models.data || mongoose.model("data",dataSchema);
export default Data;