require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const MessageQueueService = require('./services/messageQueue');

const app = express();
const port = process.env.API_PORT;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

app.post('/send/queue', async (req, res) => {
    const { registrationToken, message } = req.body;
    try {
        const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
        const messageQueueService = new MessageQueueService(RABBITMQ_URL);
        await messageQueueService.connect();
        await messageQueueService.publishToQueue('notification.fcm', { registrationToken, message });
        setTimeout(function () {
            messageQueueService.closeConnection();
        }, 500);
        res.status(200).send({ message: 'Queue sent successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Queue sent failed.' });
    }
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});