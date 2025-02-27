// src/components/Home.js
import React from 'react'
import TaskForm from './TaskForm'
import TaskList from './TaskList'

const Home = ({ tasks, onAdd, onDelete, onEdit }) => {
  return (
    <div>
      <h1>My Task List</h1>
      <TaskForm onAdd={onAdd} />
      <TaskList tasks={tasks} onDelete={onDelete} onEdit={onEdit} />
    </div>
  )
}

export default Home
