import { connect } from 'mongoose';
const mongoURI = "mongodb://localhost:27017/MyDataBase";

const connectToMongo = async () => {  
        await connect(mongoURI);
        console.log("MongoDB Connected Successfully!");
};

export default connectToMongo;

