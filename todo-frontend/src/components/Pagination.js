import React from 'react'
import '../styles/Pagination.css'

const Pagination = ({ tasks, setCurrentPage, currentPage, tasksPerPage }) => {
  const totalPages = Math.ceil(tasks.length / tasksPerPage)
  const pageGroupSize = 6
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize)
  // LAST

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' }) // optional scroll-to-top
    }
  }

  const startPage = currentGroup * pageGroupSize + 1
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages)

  const pageNumbers = []
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className='pagination'>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => handlePageChange(startPage - pageGroupSize)}>
            &larr;
          </button>{' '}
          {/* NEW ARROW */}
          <button onClick={() => handlePageChange(1)}>1</button>
          <span className='dots'>...</span>
        </>
      )}

      {pageNumbers.map(number => (
        <button
          key={number}
          className={currentPage === number ? 'active' : ''}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          <span className='dots'>...</span>
          <button onClick={() => handlePageChange(endPage + 1)}>&rarr;</button>
        </>
      )}

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
