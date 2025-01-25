import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],  
    },
    email: {
        type: String,
        required: [true, "Please provide a phone number"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
})

const Admin = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default Admin;