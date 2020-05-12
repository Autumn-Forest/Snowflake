export const config: Config = require(`./${process.env.NODE_ENV}`).default;

interface Config {
    token: string;
    mongoString: string;
    developers: string[];
    channels: {
        info: string;
        errors: string;
    };
}
