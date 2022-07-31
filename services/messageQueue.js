const amqp = require('amqplib');

class MessageQueueService {
    constructor(RABBITMQ_URL) {
        this.connection_url = RABBITMQ_URL;
    }

    async connect() {
        this.connection = await amqp.connect(this.connection_url || 'amqp://localhost');
        this.channel = await this.connection.createChannel();
    }

    async publishToQueue(queue, data) {
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    }

    async createExchange(exchange, type) {
        await this.channel.assertExchange(exchange, type, { durable: true });
    }

    async publish(exchange, routingKey, data) {
        let queue = exchange;
        if (routingKey !== undefined && routingKey.length > 0) {
            queue += `.${routingKey}`;
        }
        await this.channel.assertQueue(queue, { durable: true });
        await this.channel.bindQueue(queue, exchange, routingKey);
        this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)));
    }

    async consume(queue, messageHandler) {
        await this.channel.assertQueue(queue, { durable: true });
        await this.channel.consume(queue, async (msg) => {
            await messageHandler(msg.content.toString());
            this.channel.ack(msg);
        });
    }

    closeConnection() {
        this.connection.close();
    }
}

module.exports = MessageQueueService;
