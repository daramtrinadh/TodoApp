"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import ProtectedRoute from '../ProtectedRoute';
import ToDoItem from '../ToDoItem'; 
import './TodoHome.css'; 

const TodoHome = () => {
    const [todoItem, setTodoItem] = useState("");
    const [todoList, setTodoList] = useState([]);
    const router = useRouter();
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    useEffect(() => {
        const fetchTodos = async () => {
            if (token) {
                const response = await fetch("https://todoapp-zpso.onrender.com/api/todos", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setTodoList(data);
                } else {
                    console.error(data.error);
                }
            }
        };
        fetchTodos();
    }, [token]);

    const onEnterTask = (e) => setTodoItem(e.target.value);

    const onLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            router.push('/');
        }
    };

    const onAddTask = async () => {
        if (todoItem.trim() === "") return;

        const newTask = { text: todoItem, completed: false };

        const response = await fetch("https://todoapp-zpso.onrender.com/api/todos", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        });

        const data = await response.json();
        if (response.ok) {
            setTodoList([...todoList, data]);
            setTodoItem("");
        } else {
            console.error(data.error);
        }
    };

    const onDeleteTodo = async (id) => {
        const response = await fetch(`https://todoapp-zpso.onrender.com/api/todos/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            setTodoList(todoList.filter((todo) => todo._id !== id));
        } else {
            const data = await response.json();
            console.error(data.error);
        }
    };

    const onEditTodo = async (id, newText) => {
        const response = await fetch(`https://todoapp-zpso.onrender.com/api/todos/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: newText }),
        });

        const data = await response.json();
        if (response.ok) {
            setTodoList(todoList.map((todo) => (todo._id === id ? data : todo)));
        } else {
            console.error(data.error);
        }
    };

    const onToggleComplete = async (id) => {
        const todo = todoList.find((todo) => todo._id === id);
        const updatedTodo = { ...todo, completed: !todo.completed };

        const response = await fetch(`https://todoapp-zpso.onrender.com/api/todos/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTodo),
        });

        const data = await response.json();
        if (response.ok) {
            setTodoList(todoList.map((todo) => (todo._id === id ? data : todo)));
        } else {
            console.error(data.error);
        }
    };

    return (
        <ProtectedRoute>
            <div className='todo-container'>
                {/* Animated heading */}
                <div className='wrapper'>
                    <span className='letter letter1'>M</span>
                    <span className='letter letter2'>Y</span>
                    <span className='letter letter3'>T</span>
                    <span className='letter letter4'>O</span>
                    <span className='letter letter5'>D</span>
                    <span className='letter letter6'>O</span>
                    <span className='letter letter7'>S</span>
                </div>

                {/* Input group to add new tasks */}
                <div className='input-group'>
                    <input
                        placeholder='Enter the task'
                        type='text'
                        id='input-field'
                        onChange={onEnterTask}
                        value={todoItem}
                    />
                    <button className='submit-button' onClick={onAddTask}>
                        <span>ADD</span>
                    </button>
                    <Button onPress={onOpen} className="ml-3">Logout</Button>
                    <Modal 
                        backdrop="opaque" 
                        isOpen={isOpen} 
                        onClose={onClose}
                        onOpenChange={onOpenChange}
                        classNames={{
                        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
                        }}
                    >
                        <ModalContent>
                            <ModalHeader className="flex flex-col gap-1">Confirm Logout</ModalHeader>
                            <ModalBody>
                                <p>Are you sure you want to log out?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onClick={onLogout}>
                                    Logout
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                </div>
                

                {/* Conditional rendering to display a message if there are no tasks */}
                {todoList.length === 0 ? (
                    <p className='empty-message'>
                        No tasks available. Please add some tasks.
                    </p>
                ) : (
                    // List of todo items
                    <ul>
                        {todoList.map((eachTodo) => (
                            <ToDoItem
                                key={eachTodo._id}
                                eachTodo={eachTodo}
                                onEditTodo={onEditTodo}
                                onDeleteTodo={onDeleteTodo}
                                onToggleComplete={onToggleComplete}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </ProtectedRoute>
    );
};

export default TodoHome;