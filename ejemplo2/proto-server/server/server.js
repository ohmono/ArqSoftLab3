let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");
//creamos el servidor grpc
const server = new grpc.Server();
const SERVER_ADDRESS = "0.0.0.0:2022";

//llamar la configuracion de gRPC
let proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("../proto/chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
);
//creamos un array vacio para almacenar a los usuarios
let users = [];
//Metodo para implementar el RPC join
let join = (call) => {
  users.push(call);
  //Obtenemos el dato desde el request
  call.on("data", (message) => {
    //envie las notificaciones al join
    sendNotification({ user: message.user, text: message.text });
  });
};
//Enviamos el mensaje a todos los clientes conectados
let sendNotification = (message) => {
  //Por cada usuario escriba el mensaje
  users.forEach((user) => {
    user.write(message);
  });
};
//Adicionamos el metodo implementado al servicio
server.addService(proto.chatGroup.Chat.service, { join: join });
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
server.start();
