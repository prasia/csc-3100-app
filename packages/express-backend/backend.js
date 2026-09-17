// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
app.use(cors());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },

    {
      "id": "qwe123",
      "job": "Zookeeper",
      "name": "Cindy",
    }
  ],
};

app.use(express.json());

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserByJob = (job) => {
  return users["users_list"].filter((user) => user["job"] === job);
};

const findUserById = (id) => users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  const userWithId = {
  ...user,
  id: generateId(),
  };
  users["users_list"].push(userWithId);
  return userWithId;
};

const generateId = () => {
  return Math.random().toString(36).substring(2, 8);
};

const deleteUserById = (id) => {
  const initialLength = users["users_list"].length;
  users["users_list"] = users["users_list"].filter((user) => user.id !== id);
  return initialLength !== users["users_list"].length;
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined && job != undefined) {
    let result = users["users_list"].filter((user) => user.name === name && user.job === job);
    res.send({ users_list: result });
  }
  else if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users/:id", (req, res) => {
  const delId = req.params["id"]; //or req.params.id
  let result = findUserById(delId);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = addUser(req.body);
  res.status(201).json(userToAdd);
  // addUser(userToAdd);
  // res.status(201).send();
});

app.delete("/users/:id", (req, res) => {
  const delId = req.params.id;
  const deleted = deleteUserById(delId);
  if (deleted) {
      res.status(204).send();
  } else {
      res.status(404).send("User not found.");
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});