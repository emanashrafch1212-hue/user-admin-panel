function UserCard({ user, isLocal, onEdit, onDelete }) {
  return (
    <div className="user-card">
      <div className="card-name">{user.name}</div>
      <div className="card-email">{user.email}</div>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="card-course">{user.course}</span>
        <div className="card-actions">
          <button onClick={() => onEdit(user)} className="btn-edit">
            ✏️ Edit
          </button>
          <button onClick={() => onDelete(user.id)} className="btn-danger">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCard;