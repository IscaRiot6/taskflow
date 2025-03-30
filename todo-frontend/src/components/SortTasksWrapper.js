import React from 'react'
import SortTasks from './SortTasks'

const SortTasksWrapper = ({ tasks, setFilteredTasks }) => {
  // Wrapper component that passes setFilteredTasks instead of setTasks
  const handleSort = () => {
    const sortedTasks = [...tasks].sort((a, b) =>
      a.title.localeCompare(b.title)
    )
    setFilteredTasks(sortedTasks) // Use setFilteredTasks for favorites page
  }

  return <SortTasks tasks={tasks} setTasks={setFilteredTasks} />
}

export default SortTasksWrapper
