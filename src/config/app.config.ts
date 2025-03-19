export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3666,
    mongoDb: process.env.MONGO_DB,
    defaultLimit: process.env.DEFAULT_LIMIT || 7,  
})