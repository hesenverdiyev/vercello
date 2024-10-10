import mongoose from "mongoose";

const conn = async () =>{
    try {
        await mongoose.connect(process.env.DB_URI,{
            dbName: "anketler",
            authSource: "admin",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 20000,
            heartbeatFrequencyMS: 10000,
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            w: "majority",
        });
        console.log("Connected to the DB successfully");
    } catch (error) {
        console.log(`DB connection error: ${error}`);
    }
};

export default conn;
