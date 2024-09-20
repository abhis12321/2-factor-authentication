import mongoose from "mongoose"

export const dbConnect = () => {
    if(mongoose.connection.readyState < 1) {
        mongoose.connect(process.env.MONGO_URL)
    }
}