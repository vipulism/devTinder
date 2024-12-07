const express = require('express');
const app = express();

app.listen(7080, () => {
    console.log("Server is sucsssfully listening on port 7080")
});

app.use("/greet", (req, res) => {
    res.send("<h1>Namaste Deepa</h1>")
});