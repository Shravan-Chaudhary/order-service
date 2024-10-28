import mongoose from "mongoose";
import Config from ".";

const initDb = async () => {
    await mongoose.connect(Config.DATABASE_URL!);
    return mongoose.connection;
};

export default initDb;
