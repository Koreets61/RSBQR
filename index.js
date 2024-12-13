const https = require('node:https');
const fs = require('node:fs');

class RSBQR {
    
    constructor(param){
        this.login = param.login;
        this.merchantId = param.merchantId;
        this.account = param.account;
        this.ca = param.ca;
        this.key = param.key;
        this.cert = param.cert;
    };
    
    get_date(){
        const Data = new Date(new Date().getTime());
        const Year = Data.getFullYear();
        const Month = ('0' + (Data.getMonth() + 1)).slice(-2);
        const Day = ('0' + Data.getDate()).slice(-2);
        const Hour = ('0' + Data.getHours()).slice(-2);
        const Minutes = ('0' + Data.getMinutes()).slice(-2);
        const Seconds = ('0' + Data.getSeconds()).slice(-2);
        return Day + "." + Month + "." + Year;
    };
    
    http_options(queryString){
        
        let self = this;
        
        return {
            method: 'POST',
            ca: fs.readFileSync(self.ca),
            key: fs.readFileSync(self.key),
            cert: fs.readFileSync(self.cert),
            agent: false,
            timeout: 6000,
            headers: {
                'x-User-login': self.login,
                'Content-Type': 'application/json',
                'Content-Length': queryString.length
            }
        };
    };
    
    async getQrCode(param){
        
        let self = this;

        const query = {
            "sourceId": param.id,
            "terminalId": "26300000",
            "merchantId": self.merchantId,
            "account": self.account,
            "templateVersion": "01",
            "qrcType": "02",
            "qrcExpire": param.qrcExpire,
            "amount": param.amount,
            "currency": "RUB",
            "paymentPurpose": self.merchantId + " DATE:" + self.get_date() + " OPER:PAY",
            "redirectUrl": param.redirectUrl,
            "additionalInfo": param.additionalInfo
        };
        
        const queryString = JSON.stringify(query);
                
        return new Promise((resolve, reject) => {
            
            const req = https.request('https://212.46.217.150:7606/eis-app/eis-rs/businessPaymentService/getQrCode', self.http_options(queryString), (res) => {

                const body = [];
                
                res.on('data', (chunk) => body.push(chunk));
                res.on('end', () => {
                    const resString = Buffer.concat(body).toString();
                    const resJson = JSON.parse(resString);
                    
                    if(resJson.hasOwnProperty('code')){
                        
                        if(resJson.code !== '0'){
                            reject(resJson);
                        } else {
                            resolve(resJson);
                        };
                        
                    } else {
                        reject(resJson);
                    };
                });
                
            });

            req.on('error', (err) => {
                reject({
                    status: 'error',
                    http_code: 0,
                    message: err.message
                });
            });

            req.on('timeout', () => {
                req.destroy();
                reject({
                    status: 'error',
                    http_code: 0,
                    message: 'Request time out',
                });
            });

            req.write(queryString);
            req.end();
            
        });  
    };  
    
    async getQrdStatus(param){
        
        let self = this;
        
        const queryString = JSON.stringify(param);
        
        return new Promise((resolve, reject) => {
            
            const req = https.request('https://212.46.217.150:7606/eis-app/eis-rs/businessPaymentService/getQrdStatus', self.http_options(queryString), (res) => {

                const body = [];
                
                res.on('data', (chunk) => body.push(chunk));
                res.on('end', () => {
                    const resString = Buffer.concat(body).toString();
                    const resJson = JSON.parse(resString);
                    
                    if(resJson.hasOwnProperty('code')){
                        
                        if(resJson.code !== '0'){
                            reject(resJson);
                        } else {
                            resolve(resJson);
                        };
                        
                    } else {
                        reject(resJson);
                    };
                });
                
            });

            req.on('error', (err) => {
                reject({
                    status: 'error',
                    http_code: 0,
                    message: err.message
                });
            });

            req.on('timeout', () => {
                req.destroy();
                reject({
                    status: 'error',
                    http_code: 0,
                    message: 'Request time out'
                });
            });

            req.write(queryString);
            req.end();
            
        }); 
      
    };
    
};

module.exports = RSBQR;


