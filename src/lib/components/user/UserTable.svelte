<!-- src/lib/components/user/UserTable.svelte -->
<script lang="ts">
  interface User {
    id: number;
    firstname: string;
    middlename: string | null;
    lastname: string | null;
    gender: string | null;
    contactnumber: string | null;
    address: string | null;
    job: string | null;
    department: string | null;
    status: 'active' | 'inactive';
    email: string;
    age: number | null;
  }



  export let users: User[] = [];
  export let loading: boolean = false;
  export let selectedUserIds: number[] = [];
  export let editUser: User | null = null;
  export let setEditUser: (user: User) => void;
  export let deleteUser: (id: number) => void;
  export let toggleUserSelection: (id: number) => void; // Added prop



  // New state for search and pagination
  let searchQuery = '';
  let currentPage = 1;
  const itemsPerPage = 5;

  // Computed filtered users based on search query
  $: filteredUsers = users.filter(user =>
    (user.firstname + ' ' + (user.middlename || '') + ' ' + (user.lastname || '')).toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Computed paginated users
  $: paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total pages
  $: totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
</script>

<div class="overflow-x-auto">
  <input type="text" placeholder="Search..." bind:value={searchQuery} class="mb-4 p-2 border rounded" />
  {#if loading && users.length === 0}
    <p class="text-center py-4">Loading users...</p>
  {:else}
    <table class="min-w-full bg-white">
      <thead>
        <tr class="border-b">
          <th class="px-4 py-2 text-left">Name</th>
          <th class="px-4 py-2 text-left">Email</th>
          <th class="px-4 py-2 text-left">Age</th>
          <th class="px-4 py-2 text-left">Gender</th>
          <th class="px-4 py-2 text-left">Contact Number</th>
          <th class="px-4 py-2 text-left">Address</th>
          <th class="px-4 py-2 text-left">Job</th>
          <th class="px-4 py-2 text-left">Department</th>
          <th class="px-4 py-2 text-left">Status</th>
          <th class="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each paginatedUsers as user}
          <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-2">{user.firstname} {user.middlename ? user.middlename + ' ' : ''}{user.lastname}</td>
            <td class="px-4 py-2">{user.email}</td>
            <td class="px-4 py-2">{user.age || '-'}</td>
            <td class="px-4 py-2">{user.gender || '-'}</td>
            <td class="px-4 py-2">{user.contactnumber || '-'}</td>
            <td class="px-4 py-2">{user.address || '-'}</td>
            <td class="px-4 py-2">{user.job || '-'}</td>
            <td class="px-4 py-2">{user.department || '-'}</td>
            <td class="px-4 py-2">{user.status}</td>
            <td class="px-4 py-2 flex gap-2">
              <button
                on:click={() => setEditUser(user)}
                class="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                on:click={() => deleteUser(user.id)}
                class="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="flex justify-between mt-4">
      <button on:click={() => currentPage = Math.max(currentPage - 1, 1)} disabled={currentPage === 1} class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button on:click={() => currentPage = Math.min(currentPage + 1, totalPages)} disabled={currentPage === totalPages} class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
        Next
      </button>
    </div>
  {/if}
</div>