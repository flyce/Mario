module.exports = {
    port: '' || 3000,
    environment: 'dev',
    database: {
        dbName: 'YOUR_DATABASE_NAME',
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'YOUR_DATABASE_PASSWORD'
    },
    security: {
        // You can use the following command on the node command line to generate a secure key
        // require('crypto').randomBytes(64).toString('hex')
        accessToken: {
            secretKey: "YOUR_ACCESS_TOKEN_SECRET_KEY_HERE",
            expiresIn: 60 * 60 * 2
        },
        refreshToken: {
            secretKey: "YOUR_REFRESH_TOKEN_SECRET_KEY_HERE",
            expiresIn: 60 * 60 * 24 * 30
        }
    },
    wx: {
        appId: 'YOUR_WECHAT_APPID',
        appSecret: 'YOUR_WECHAT_SECRET',
        loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    },
    fileUpload: {
        path: './upload',
        
    },
    static: './static'
}