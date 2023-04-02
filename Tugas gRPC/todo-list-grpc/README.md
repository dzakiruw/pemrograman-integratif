# Implementasi CRUD GRPC dan protobuf dengan NODE JS
# (Todo List)
## Menggunakan:
• node.js    
• mysql     
• vue.js

## Code Server.js:
```sh
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

export function AddTodo(call, callback) {
  const todos = call.request;

  connection.query("INSERT INTO todos SET ?", todos, (error, result) => {
    if (error) throw error;

    todos.id = result.insertId;
    callback(null, "Todo added");
  });
}

export function FindTodo(call, callback) {
  const id = call.request.id;

  connection.query("SELECT * FROM todos WHERE id = ?", id, (error, results) => {
    if (error) throw error;

    const todo = results[0];
    callback(null, todo);
  });
}

export function GetAllTodos(call, callback) {
  connection.query("SELECT * FROM todos", (error, results) => {
    if (error) throw error;

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
      if (error) throw error;

      callback(null, todo);
    }
  );
}

export function RemoveTodo(call, callback) {
  const id = call.request.id;

  connection.query("DELETE FROM todos WHERE id = ?", id, (error, result) => {
    if (error) throw error;

    callback(null, "Todo deleted");
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
```

# Output
## CREATE todo
![output-create-todo](https://i.ibb.co/ZSxLxfb/Screenshot-2023-04-03-012919.png)

## READ User
![output-read-todo](https://i.ibb.co/0M7jxxq/Screenshot-2023-04-03-013110.png)

## UPDATE User
![output-update-todo](https://i.ibb.co/Vq9ZCL7/Screenshot-2023-04-03-013445.png)

## DELETE User
![output-delete-todo](https://i.ibb.co/vw1LSr2/Screenshot-2023-04-03-013524.png)
