import os from "os";
import Config from "../../config";

export const getSystemHealth = () => {
    return {
        cpuUsage: os.loadavg(),
        totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed()} MB`,
        freeMemory: `${(os.freemem() / 1024 / 1024).toFixed()} MB`
    };
};

export const getApplicationHealth = () => {
    return {
        environment: Config.ENV,
        upTime: `${process.uptime().toFixed(2)} Seconds`,
        memoryUsage: {
            heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed()} MB`,
            heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed()} MB`
        }
    };
};
