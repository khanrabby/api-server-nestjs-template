export const ENVIRONMENT = process.env.NODE_ENV;
 export const IS_PROD = ENVIRONMENT === "dev"; // Anything else is treated as 'dev'
//export const IS_PROD = true; // Anything else is treated as 'dev'
export const REPORT_DB_CONNECTION_NAME = process.env.REPORTS_DB_NAME;
