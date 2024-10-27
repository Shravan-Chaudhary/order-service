import dotenvFlow from "dotenv-flow";

dotenvFlow.config();

const Config = {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    BASE_URL: process.env.BASE_URL,
    JWKS_URI: process.env.JWKS_URI
};

export default Config;
