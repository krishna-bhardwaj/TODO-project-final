import React, { useEffect, useState } from "react";
import "../styles/TodoApp.css";
import { useContext } from "react";
import { LoginContext } from "../store/loginContext";
import { TodoItemsContext } from "../store/todoContext";
import TodoItemTab from "./TodoItemTab";

function TodoApp() {
  const { logged_in_user } = useContext(LoginContext);
  const { tasks, dispatchAction } = useContext(TodoItemsContext);
  const [inputTitle, setInputTitle] = useState("");
  const handleAddTodo = async() => {
    if (inputTitle.length == 0) {
      alert("Title cannot be empty");
      return;
    }
    setInputTitle(inputTitle=>"");
    try {
        const response = await fetch("http://localhost:5000/api/v2/addtask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: inputTitle,
            user: logged_in_user,
          }),
        });
  
        if (response.ok) {
          const json = await response.json();
          dispatchAction({ type: "ADD_TASK", payload: json});
        } else {
          const json = await response.json();
          alert(json.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
  };

  return (
    <div className="todoContainer relative">
      <div className="addTodo">
        <input
          type="text"
          placeholder="Add todo"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
        />
        <button onClick={() => handleAddTodo()}>Add Todo</button>
      </div>
      <div className="todoListContainer">
        {tasks && tasks.map((todo, index) => (
          <TodoItemTab
            todo={todo}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

export default TodoApp;
