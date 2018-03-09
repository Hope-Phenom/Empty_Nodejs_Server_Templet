import * as websocket from "websocket";
import * as https from "https";
import * as fs from "fs"; // 需要引用node.js的fs来读取三个SSL证书文件

const WebSocketServer: typeof websocket.server = websocket.server;

// https Server
let options: any = {
    key: fs.readFileSync("./key/private.key", "utf8"), // 这里设置三个证书的位置，记得指明“utf8”编码，key、cert、ca三个属性必须都有且对应三个文件  
    cert: fs.readFileSync("./key/certificate.crt", "utf8"),
    ca: fs.readFileSync("./key/ca_bundle.crt", "utf8")
};

let httpsServer: any = https.createServer(options, (request, response) => { // 注意这里已经是https了
    console.log("received a request");
    response.writeHead(200);
    response.end("hello world\n");
});

// websocket Server
let wsServer: websocket.server = new WebSocketServer({
    httpServer: httpsServer, // 对应的这里的httpServer后面也应该是对应的httpsSrver（名称无所谓但是本体应该是httpsServer）
    autoAcceptConnections: true
});

// 事件监听
wsServer.on("connect", (connection) => {
    console.log(">>>come from: " + connection.remoteAddress);
    connection.on("message", (message) => {
        console.log(message.type);
        console.log(">>>message: ", message);
        connection.sendUTF(message.utf8Data); // 把接收到的信息发回去
    });

    connection.on("close", (reasonCode, description) => {
        console.log(connection.remoteAddress + " has disconnected.");
    });
});

// 启动服务器
httpsServer.listen(443, () => { // 端口
    console.log(">>>Https Server is listening on port 443!");
});