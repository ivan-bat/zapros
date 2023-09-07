import React, { useState, useEffect } from "react";
import axios from "axios";
import { ListGroup } from "react-bootstrap";

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <ListGroup>
      {todos.map((todo) => (
        <ListGroup.Item key={todo.id}>{todo.title}</ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default TodoList;
