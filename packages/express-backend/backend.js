// backend.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import {
  findAllUsers,
  findUserByName,
  findUserByJob,
  findUserByNameAndJob,
  findUserById,
  addUser,
  deleteUserById,
} from "./services/user-service.js";

const app = express();
const port = 8000;
app.use(cors());

// const users = {
//   users_list: [
//     {
//       id: "xyz789",
//       name: "Charlie",
//       job: "Janitor",
//     },
//     {
//       id: "abc123",
//       name: "Mac",
//       job: "Bouncer",
//     },
//     {
//       id: "ppp222",
//       name: "Mac",
//       job: "Professor",
//     },
//     {
//       id: "yat999",
//       name: "Dee",
//       job: "Aspring actress",
//     },
//     {
//       id: "zap555",
//       name: "Dennis",
//       job: "Bartender",
//     },

//     {
//       "id": "qwe123",
//       "job": "Zookeeper",
//       "name": "Cindy",
//     }
//   ],
// };

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

app.use(express.json());

// const findUserByName = (name) => {
//   return users["users_list"].filter((user) => user["name"] === name);
// };

// const findUserByJob = (job) => {
//   return users["users_list"].filter((user) => user["job"] === job);
// };

// const findUserById = (id) => users["users_list"].find((user) => user["id"] === id);

// const addUser = (user) => {
//   const userWithId = {
//   ...user,
//   id: generateId(),
//   };
//   users["users_list"].push(userWithId);
//   return userWithId;
// };

// const generateId = () => {
//   return Math.random().toString(36).substring(2, 8);
// };

// const deleteUserById = (id) => {
//   const initialLength = users["users_list"].length;
//   users["users_list"] = users["users_list"].filter((user) => user.id !== id);
//   return initialLength !== users["users_list"].length;
// };

// app.get("/users", (req, res) => {
//   const name = req.query.name;
//   const job = req.query.job;
//   if (name != undefined && job != undefined) {
//     let result = users["users_list"].filter((user) => user.name === name && user.job === job);
//     res.send({ users_list: result });
//   }
//   else if (name != undefined) {
//     let result = findUserByName(name);
//     result = { users_list: result };
//     res.send(result);
//   } else {
//     res.send(users);
//   }
// });

app.get("/users", async (req, res) => {
  const { name, job } = req.query;

  try {
    let result;

    if (name !== undefined && job !== undefined) {
      result = await findUserByNameAndJob(name, job);
    } else if (name !== undefined) {
      result = await findUserByName(name);
    } else if (job !== undefined) {
      result = await findUserByJob(job);
    } else {
      result = await findAllUsers();
    }

    res.send({ users_list: result });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to retrieve users.");
  }
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users/:id", async (req, res) => {
  try {
    const result = await findUserById(req.params.id);

    if (result === null) {
      res.status(404).send("Resource not found.");
    } else {
      res.send(result);
    }

  } catch (error) {
    console.error(error);
    res.status(404).send("Resource not found.");
  }
});

app.post("/users", async (req, res) => {
  try {
    const createdUser = await addUser(req.body);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(400).send("Unable to create user.");
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await deleteUserById(req.params.id);

    if (deletedUser === null) {
      res.status(404).send("User not found.");
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error(error);
    res.status(404).send("User not found.");
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});