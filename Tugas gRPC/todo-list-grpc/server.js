import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import mysql from "mysql";

const PROTO_PATH = "./todo.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const TodosService = grpcObject.todo.TodoService;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todos",
});

connection.connect();

function AddTodo(call, callback) {
  const todos = call.request;

  connection.query("INSERT INTO todos SET ?", todos, (error, result) => {
    if (error) throw error;

    todos.id = result.insertId;
    callback(null, "Todo added");
  });
}

function FindTodo(call, callback) {
  const id = call.request.id;

  connection.query("SELECT * FROM todos WHERE id = ?", id, (error, results) => {
    if (error) throw error;

    const todo = results[0];
    callback(null, todo);
  });
}

function UpTodo(call, callback) {
  const tod = call.request;

  connection.query(
    "UPDATE todos SET title = ?, description = ?, done = ?, WHERE id = ?",
    [todo.title, todo.description, todo.done, todo.id],
    (error, result) => {
      if (error) throw error;

      callback(null, todo);
    }
  );
}

function RemoveTodo(call, callback) {
  const id = call.request.id;

  connection.query("DELETE FROM todos WHERE id = ?", id, (error, result) => {
    if (error) throw error;

    callback(null, "Todo deleted");
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(TodosService.service, {
    CreateTodo: AddTodo,
    ReadTodo: FindTodo,
    UpdateTodo: UpTodo,
    DeleteTodo: RemoveTodo,
  });

  server.bindAsync(
    "localhost:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("Server started on port 50051");
    }
  );
}

main();