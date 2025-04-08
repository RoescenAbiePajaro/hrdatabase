<!-- src/lib/components/user/UserTable.svelte -->
<script lang="ts">
  interface Employee {
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



  export let employees: Employee[] = [];
  export let loading: boolean = false;
  export let selectedEmployeeIds: number[] = [];
  export let editEmployee: Employee | null = null;
  export let setEditEmployee: (employeess: Employee) => void;
  export let deleteEmployee: (id: number) => void;
  export let toggleEmployeeSelection: (id: number) => void; // Added prop



  // New state for search and pagination
  let searchQuery = '';
  let currentPage = 1;
  const itemsPerPage = 5;

  // Computed filtered users based on search query
  $: filteredEmployees = employees.filter(employeess => {
    const name = [
      employeess.firstname || '',
      employeess.middlename || '',
      employeess.lastname || ''
    ].join(' ').toLowerCase();
    
    return [
      name,
      employeess.email || '',
      employeess.job || '',
      employeess.department || '',
      employeess.status || ''
    ].some(field => field.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Computed paginated users
  $: paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total pages
  $: totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
</script>

<div class="overflow-x-auto">
  <input type="text" placeholder="Search..." bind:value={searchQuery} class="mb-4 p-2 border rounded" />
  {#if loading && employees.length === 0}
    <p class="text-center py-4">Loading employees...</p>
  {:else}
    <table class="min-w-full bg-white">
      <thead>
        <tr class="border-b">
          <th class="px-4 py-2 text-left">FirstName</th>
          <th class="px-4 py-2 text-left">Middle Name</th>
          <th class="px-4 py-2 text-left">Last Name</th>
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
        {#each paginatedEmployees as employeess}
          <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-2">{employeess.firstname|| '-'}</td>
            <td class="px-4 py-2">{employeess.middlename || '-'}</td>
            <td class="px-4 py-2">{employeess.lastname || '-'}</td>
            <td class="px-4 py-2">{employeess.email || '-'}</td>
            <td class="px-4 py-2">{employeess.age || '-'}</td>
            <td class="px-4 py-2">{employeess.gender || '-'}</td>
            <td class="px-4 py-2">{employeess.contactnumber || '-'}</td>
            <td class="px-4 py-2">{employeess.address || '-'}</td>
            <td class="px-4 py-2">{employeess.job || '-'}</td>
            <td class="px-4 py-2">{employeess.department || '-'}</td>
            <td class="px-4 py-2">{employeess.status}</td>
            <td class="px-4 py-2 flex gap-2">
              <button
                on:click={() => setEditEmployee(employeess)}
                class="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                on:click={() => deleteEmployee(employeess.id)}
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