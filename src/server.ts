import express from "express";

const app = express();
const PORT = 1882;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});