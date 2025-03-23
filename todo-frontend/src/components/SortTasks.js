import React from 'react'

const SortTasks = ({ tasks, setTasks }) => {
  const handleSort = () => {
    const sortedTasks = [...tasks].sort((a, b) =>
      a.title.localeCompare(b.title)
    )
    setTasks(sortedTasks)
  }

  return (
    <button onClick={handleSort} className='sort-button'>
      Sort A-Z
    </button>
  )
}

export default SortTasks
