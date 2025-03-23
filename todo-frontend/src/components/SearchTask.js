import React, { useState } from 'react'
import '../styles/SearchTask.css'

const SearchTask = ({ tasks, setFilteredTasks }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = e => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(query)
    )

    setFilteredTasks(filtered)
  }

  return (
    <div className='search-container'>
      <input
        type='text'
        placeholder='Search tasks...'
        value={searchQuery}
        onChange={handleSearch}
        className='search-input'
      />
    </div>
  )
}

export default SearchTask
