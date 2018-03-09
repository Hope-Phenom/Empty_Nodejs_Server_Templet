import * as websocket from "websocket";
import * as http from "http";

const WebSocketServer: typeof websocket.server = websocket.server;

// 创建一个http Server
let httpServer: http.Server = http.createServer((request, response) => {
    console.log("received a request");
    response.writeHead(404);
    response.end();
});

// 创建一个websocket Server，websocket Server需要建立在http server之上
let wsServer: websocket.server = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: true
});

// 事件监听
wsServer.on("connect", (connection) => {
    console.log(">>>come from: " + connection.remoteAddress); // 显示连接客户端的ip地址
    connection.on("message", (message) => {
        console.log(message.type);
        console.log(">>>message: ", message); // 接收到信息的类型和内容，注意都是utf8编码
        connection.sendUTF(message.utf8Data); // 把接收到的信息发回去
    });

    connection.on("close", (reasonCode, description) => {
        console.log(connection.remoteAddress + " has disconnected.");
    });
});

// 启动服务器
httpServer.listen(80, () => {
    console.log(">>>Http Server is listening on port 80!");
});