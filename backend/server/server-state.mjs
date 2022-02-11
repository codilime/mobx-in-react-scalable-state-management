
export const serverState = {
  users: [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@foo.local' },
    { id: '2', firstName: 'Mary', lastName: 'Smith', email: 'mary.smith@foo.local' },
  ],

  dashboards: [
    {
      id: '1',
      ownedBy: '1',
      name: 'Home Dashboard',
    },
    {
      id: '2',
      ownedBy: '2',
      name: 'Home Dashboard',
    },
  ],

  nextUserId() {
    return `${Math.max(...this.users.map(u => parseInt(u.id))) + 1}`;
  }
}