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

connection.connect((err) => {
  if (err) {
    console.error(`Error connecting to the database: ${err.stack}`);
    return;
  }
  console.log('Connected to the database as ID:', connection.threadId);
});

//memanggil objek dan callback fungsi sebagai parameter
export function AddTodo(call, callback) {
  //inisialisasi pemanggilan objek berisi request
  const todos = call.request;

  connection.query("INSERT INTO todos SET ?", todos, (error, result) => {
    if (error) {
      console.error(`Error adding todo: ${error.stack}`);
      return callback(error);
    }
    console.log(`Todo with id ${result.insertId} added`);
    callback(null, { id: result.insertId });
  });
}

export function FindTodo(call, callback) {
  const id = call.request.id;

  connection.query("SELECT * FROM todos WHERE id = ?", id, (error, results) => {
    if (error) {
      console.error(`Error finding todo: ${error.stack}`);
      return callback(error);
    }

    console.log(`Todo with id ${id} found`);
    const todo = results[0];
    callback(null, todo);
  });
}

export function GetAllTodos(call, callback) {
  connection.query("SELECT * FROM todos", (error, results) => {
    if (error)
      if (error) {
        console.error(`Error getting all todos: ${error.stack}`);
        return callback(error);
      }

    const todos = results;
    callback(null, { todos: todos });
  });
}

export function UpTodo(call, callback) {
  const todo = call.request;

  connection.query(
    "UPDATE todos SET title = ?, description = ?, done = ? WHERE id = ?",
    [todo.title, todo.description, todo.done, todo.id],
    (error, result) => {
      if (error) {
        console.error(`Error updating todo: ${error.stack}`);
        return callback(error);
      }
      console.log(`Todo with id ${todo.id} updated`);
      callback(null, todo);
    }
  );
}

export function RemoveTodo(call, callback) {
  const id = call.request.id;

  connection.query("DELETE FROM todos WHERE id = ?", id, (error, result) => {
    if (error) {
      console.error(`Error removing todo: ${error.stack}`);
      return callback(error);
    }

    console.log(`Todo with id ${id} deleted`);
    callback(null, {});
  });
}

export function main() {
  const server = new grpc.Server();
  server.addService(TodosService.service, {
    CreateTodo: AddTodo,
    ReadTodo: FindTodo,
    UpdateTodo: UpTodo,
    DeleteTodo: RemoveTodo,
    GetAllTodo: GetAllTodos,
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
