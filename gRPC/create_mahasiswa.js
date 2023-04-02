const client = require("./client");

client.CreateMahasiswa(
  {
    id: "3",
    nama: "Rudi",
    nrp: "5119",
    nilai: 59,
  },
  (error, mahasiswa) => {
    if (error) throw error;
    console.log(mahasiswa);
  }
);
