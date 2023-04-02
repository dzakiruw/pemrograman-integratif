const client = require("./client");

client.getAll({}, (error, mahasiswa) => {
  if (error) throw error;
  console.log(mahasiswa);
});
