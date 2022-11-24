const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models/");
db.mongoose
    .connect(db.url)
    .then(() => {
        console.log('Database Connected!');
    })
    .catch((err) => {
        console.log('cannot connect to the database', err);
        process.exit()
    })



app.get("/", (req, res) => {
  res.json({
    message: "Hello Bro ayoo",
  });
});

// require('./app/routes/post.routes')(app)
require('./app/routes/user.routes')(app)


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is runnning on http://localhost:${PORT}`);
});
