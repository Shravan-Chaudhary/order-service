import dotenvFlow from "dotenv-flow";

dotenvFlow.config();

const Config = {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    BASE_URL: process.env.BASE_URL,
    JWKS_URI: process.env.JWKS_URI,
    DATABASE_URL: process.env.DATABASE_URL,
    CORS_CLIENT_URL: process.env.CORS_CLIENT_URL,
    CORS_ADMIN_URL: process.env.CORS_ADMIN_URL
};

export default Config;
