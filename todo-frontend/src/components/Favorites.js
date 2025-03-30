import TaskItem from './TaskItem'

const Favorites = ({ favoriteTasks, onFavorite, isFavoritesPage }) => {
  return (
    <div>
      {/* <h3>Favorite Tasks</h3> */}
      <ul className='task-list'>
        {favoriteTasks.length > 0 ? (
          favoriteTasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onFavorite={onFavorite}
              isFavoritesPage={isFavoritesPage} // Pass this prop
            />
          ))
        ) : (
          <p>No favorite tasks found.</p>
        )}
      </ul>
    </div>
  )
}

export default Favorites
