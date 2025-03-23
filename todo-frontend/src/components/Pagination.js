import React from 'react'
import '../styles/Pagination.css'

const Pagination = ({ tasks, setCurrentPage, currentPage, tasksPerPage }) => {
  const totalPages = Math.ceil(tasks.length / tasksPerPage)

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className='pagination'>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      <span>
        {' '}
        Page {currentPage} of {totalPages}{' '}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
