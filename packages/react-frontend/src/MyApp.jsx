// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    // const updated = characters.filter((character, i) => {
    //   return i !== index;
    // });
    // setCharacters(updated);
    const userToDelete = characters[index];

    fetch(`http://localhost:8000/users/${userToDelete.id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.status === 204) {
        setCharacters((currentCharacters) => currentCharacters.filter((character) => character.id !== userToDelete.id)
      );
      } else if (response.status === 404) {
        console.log("User not found.");
      } else {
        throw new Error(`Delete failed with status ${response.status}`);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status !== 201) {
          return null;
        }

        return response.json();
      })
      .then((createdUser) => {
        if (createdUser !== null) {
          setCharacters((currentCharacters) => [
            ...currentCharacters,
            createdUser,
          ]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
    }

  useEffect(() => {
  fetchUsers()
    .then((res) => res.json())
    .then((json) => setCharacters(json["users_list"]))
    .catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;