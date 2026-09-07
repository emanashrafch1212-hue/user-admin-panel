import UserCard from './UserCard';

function UserList({ users, onEdit, onDelete }) {
  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-xl font-semibold">No users found</p>
        <p className="text-sm mt-1">Add your first user using the form above</p>
      </div>
    );
  }

  return (
    <div id="userTableBody">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          isLocal={false}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default UserList;