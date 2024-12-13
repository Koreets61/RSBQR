# RSBQR
Реализация пакета NPM для NodeJS реализующая получение QR СБП кода, через процессинг Банка Русский Стандарт


> # Отказ от ответственности
> Данная реализация класса написана исключительно для личного использования, и выложена на общедоступный ресурс как один из многих примеров того, как это можно реализовать. 


## Пример


#### Инициализация
```
const RSBQR = require('@koreets61/RSBQR');

const rsbQR = new RSBQR({
    login: '837747',
    merchantId: 'MB0000598977',
    account: '40802810700000026650',
    ca: 'cert\\certca_9697.pem',
    key: 'cert\\PrivateKey256.pem',
    cert: 'cert\\c_14331.pem'
});

```

> #### Параметры инициализации класса
> **login** - x-User-login предоставляется сотрудником Банка;\
> **merchantId** - предоставляется сотрудником Банка;\
> **account** - предоставляется сотрудником Банка;\
> **ca** - предоставляется сотрудником Банка;\
> **key** - предоставляется сотрудником Банка;\
> **cert** - предоставляется сотрудником Банка;

#### Использование

```
const param = {
    id: '779', // Уникальный номер заказа (формируется продавцом)
    qrcExpire: 3, // Время жизни QR в минутах
    amount: 1000, // Сумма в копейках
    redirectUrl: 'https://github.com/Koreets61/RSBQR', // Куда направим покупателя?
    additionalInfo: [ // Массив для аналитики (не более 10 пар)
        {
            key: "POST_1",
            value: 1000
        }
    ]
};

rsbQR.getQrCode(param).then(results => { // Создать QR
    
    console.log(results);
    
    setTimeout(() => {
        getStatus({
            sourceId: results.sourceId,
            operationId: results.operationId,
            qrcId: results.data.qrcId
        });
    }, 3000);
}).catch(error => {
    console.log(error);
});

function getStatus(query){
    
    rsbQR.getQrdStatus(query).then(results => { // Узнать статус QR
        console.log(results);
    }).catch(error => {
        console.log(error);
    });
    
};
```

#### Ответ rsbQR.getQrCode

```
{
    "sourceId": "QR200000000006116",
    "operationId": "20200220000000000000000000007382",
    "code": "0",
    "message": "ОК",
    "data": {
        "qrcId": "AD10002K1FOOHE4M9JPAE8EDVPGPMJ6H",
        "payload": "https://qr.nspk.ru/AS1000670LSS7DN18SJQDNP4B05KLJL2?type=01&bank=100000000001&sum=10000&cur=RUB&crc=C08B",
        "payloadBase64": "aHR0cHM6Ly9xci5uc3BrLnJ1L0FTMTAwMDY3MExTUzdETjE4U0pRRE5QNEIwNUtMSkwyP3R5cGU9MDEmYmFuaz0xMDAwMDAwMDAwMDEmc3VtPTEwMDAwJmN1cj1SVUImY3JjPUMwOEI=",
        "status": "CREATED"
    }
}
```

#### Ответ rsbQR.getQrdStatus

```
{
    "sourceId": "QR200000000006116",
    "operationId": "20200220000000000000000000007382",
    "code": "0",
    "message": "ОК",
    "data": {
        "qrcId": "AD10002K1FOOHE4M9JPAE8EDVPGPMJ6H",
        "status": "ACCEPTED",
        "trxId": "A0051135225394010000045DEF0D7D21"
    },
    "paymentdata": {
        "documentId": "651651",
        "senderBank": "Банк Русский Стандарт",
        "senderBankBiс": "004457896",
        "senderName": "Иван Иванович И.",
        "senderAccount": "12345678900987654321",
        "paymentPurpose": "MID:MA0000000001 DATE: 01.01.2024 OPER:PAY",
        "amount ": "10000",
        "settlementDate": "2020-11-01"
    }
}
```

> #### Статус операции, инициированной динамическим QR-кодом (qrcType=02):
> **NOT_STARTED** - оплата по QR коду не инициирована;\
> **RECEIVED_OPKC** - операция в обработке (передана для обработки в ОПКЦ), при 32 Версия 5.5 получении данного ответа необходимо повторить запрос статуса;\
> **IN_PROGRESS_OPKC** - операция в обработке (передана для обработки в ЦБ), при получении данного ответа необходимо повторить запрос статуса;\
> **ACCEPTED** - операция завершена успешно;\
> **DECLINED** - операция отклонена;\
> **EXPIRED** - qr код просрочен;
