require('dotenv').config();
const MessageQueueService = require('./services/messageQueue');
const FCMService = require('./services/fcm');
const { insertRecord } = require('./services/db');

async function connect() {
    const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
    const messageQueueService = new MessageQueueService(RABBITMQ_URL);
    const fcmService = new FCMService();
    try {
        await messageQueueService.connect();
        await messageQueueService.consume('notification.fcm', async (msg) => {
            try {
                const data = JSON.parse(msg);
                await fcmService.send(data.registrationToken, { message: data.message });
                const date = new Date().toISOString().slice(0, 19).replace("T", " ");
                await insertRecord(data.registrationToken, date);
            } catch (error) {
                console.log(error);
            }
        });   
    } catch (error) {
        console.log(error);
    }
}

connect();    
