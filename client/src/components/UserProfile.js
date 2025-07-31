import React from 'react';

function UserProfile({ user }) {
  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Recipes Shared:</strong> {user?.recipes?.length || 0}</p>
    </div>
  );
}

export default UserProfile;
