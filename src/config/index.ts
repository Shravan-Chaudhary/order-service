import dotenvFlow from "dotenv-flow";

dotenvFlow.config();

const Config = {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    BASE_URL: process.env.BASE_URL,
    JWKS_URI: process.env.JWKS_URI,
    DATABASE_URL: process.env.DATABASE_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    ADMIN_URL: process.env.ADMIN_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
};

export default Config;
