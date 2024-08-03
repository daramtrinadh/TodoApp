// components/ToDoItem.jsx
"use client";

import React, { useState } from "react";
import EditModal from "./EditModal"; 
import './ToDoItem.css';

const ToDoItem = ({ eachTodo, onEditTodo, onDeleteTodo, onToggleComplete }) => {
    const { _id, text, completed } = eachTodo; 
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(text);

    // Handle change in the edit input field
    const handleEditChange = (e) => {
        setNewText(e.target.value);
    };

    // Handle submission of the edited todo item
    const handleEditSubmit = () => {
        onEditTodo(_id, newText);
        setIsEditing(false);
    };

    return (
        <li className={`todo-item ${completed ? "completed" : ""}`}>
            <div className="checkbox-section">
                {/* Checkbox to toggle the completion status */}
                <input
                    type="checkbox"
                    className="checkbox"
                    checked={completed}
                    onChange={() => onToggleComplete(_id)}
                />
                {/* Display the todo text */}
                <span className="task-text" style={{ textDecoration: completed ? 'line-through' : 'none' }}>
                    {text}
                </span>
            </div>
            <div className="edit-delete-sec">
                {/* Button to trigger edit mode */}
                <button className="editBtn" onClick={() => setIsEditing(true)}>
                    Edit
                </button>
                {/* Button to delete the todo item */}
                <button className="del-button" onClick={() => onDeleteTodo(_id)}>
                    {/* SVG for delete icon */}
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 69 14'
                        className='svgIcon bin-top'>
                        <g clipPath='url(#clip0_35_24)'>
                        <path
                            fill='black'
                            d='M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z'></path>
                        </g>
                        <defs>
                        <clipPath id='clip0_35_24'>
                            <rect fill='white' height='14' width='69'></rect>
                        </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>
            {/* Modal for editing the todo item */}
            {isEditing && (
                <EditModal
                    isOpen={isEditing}
                    onClose={() => setIsEditing(false)}
                    onSave={handleEditSubmit}
                    value={newText}
                    onChange={handleEditChange}
                />
            )}
        </li>
    );
};

export default ToDoItem;
