import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";


const PROTO_PATH = "./todo.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const TodosService = grpcObject.todo.TodoService;

const client = new TodosService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

export function AddTodo(title, description, done) {
  const todos = {
    title: title,
    description: description,
    done: done,
  };

  client.AddTodo(todos, (error, response) => {
    console.log(response);
    if (error) {
      console.error(error);
      return;
    }

    console.log(`Todo added`);
  });
}

export function FindTodo(id) {
  client.FindTodo({ id: id }, (error, response) => {
    if (error) {
      console.error(error);
      return;
    }

    console.log(response);
  });
}

export function UpTodo(id, title, description, done) {
  const todos = {
    id: id,
    title: title,
    description: description,
    done: done,
  };

  client.UpTodo(todos, (error, response) => {
    if (error) {
      console.error(error);
      return;
    }

    console.log(`Updated todo id ${response.id}`);
  });
}

export function RemoveTodo(id) {
  client.RemoveTodo({ id: id }, (error, response) => {
    if (error) {
      console.error(error);
      return;
    }

    console.log(`Deleted todo id ${id}`);
  });
}

export function main() {
  const form = document.getElementById("form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const done = document.getElementById("done").checked;
    AddTodo(title, description, done);
  });

  GetAllTodos();
}

main();

// Contoh penggunaan fungsi-fungsi CRUD
// AddTodo("Belajar", "Backend Developer", true);
// readUser(1);
// updateUser(1, 'Belajar', 'Backend Developer', true);
// deleteUser(1);