let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");
let readline = require("readline");
let reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//llamar la configuracion de gRPC
let proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("./proto/chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
);
const REMOTE_URL = "0.0.0.0:2022";

let username;

//creamos el cliente GRPC
let client = new proto.chatGroup.Chat(
  REMOTE_URL,
  grpc.credentials.createInsecure()
);

//Preguntamos el nombre al usuario
reader.question("Por favor ingrese su username: ", (answer) => {
  username = answer;
  startChat();
});

//Iniciamos el Stream entre el servidor y el cliente
let startChat = () => {
  //Enlace el servicio de chat
  let channel = client.join();
  //Escriba el request
  channel.write({ user: username, text: "Estoy enlazado..." });
  //obtenga los datos del response
  channel.on("data", (message) => {
    if (message.user == username) {
      return;
    }
    console.log(`${message.user}: ${message.text}`);
  });
  //Leer la linea por terminal
  reader.on("line", (text) => {
    channel.write({ user: username, text: text });
  });
};
