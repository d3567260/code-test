# Setup guide 
1. Build Firebase Project according to [firebase/quickstart-js](https://github.com/firebase/quickstart-js/tree/master/messaging) and get Instance ID token (IID Token)
2. `git clone https://github.com/d3567260/code-test.git`
3. `cp .env.example .env`
4. Copy and paste your private key to serviceAccountKey.json
5. run `docker-compose up`
6. run `npm install`
7. run `node consume.js`
8. create a new terminal and run `node app.js`
9. `curl -d '{"registrationToken":"<IID Token>", "message":"<Message>"}' -H "Content-Type: application/json" -X POST http://localhost:3000/send/queue`
