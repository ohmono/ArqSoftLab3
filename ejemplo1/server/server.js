let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");

//creamos el servidor grpc
const server = new grpc.Server();
const URL = "0.0.0.0:2022";

//llamar la configuracion de gRPC
let proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("../proto/welcome-world.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
);

//Cargar la funcion de respuesta
function greetUser(call, callBack) {
  callBack(null, { message: `Hola ${call.request.name} bienvenido a la UdeA` });
}

//Enlazar el servicio del IDL al servidor
server.addService(proto.welcome.WelcomeService.service, {
  greetUser: greetUser,
});
server.bind(URL, grpc.ServerCredentials.createInsecure());
server.start();
