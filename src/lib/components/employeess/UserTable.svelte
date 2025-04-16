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

  // Ensure selectedEmployeeIds is always an array
  $: {
    if (!Array.isArray(selectedEmployeeIds)) {
      selectedEmployeeIds = [];
    }
  }

  // Computed filtered users based on search query
  $: filteredEmployees = employees.filter(employee => {
    const searchFields = [
      employee.firstname,
      employee.middlename,
      employee.lastname,
      employee.email,
      employee.job,
      employee.department,
      employee.status
    ]
      .filter(Boolean) // Remove null/undefined values
      .map(field => (field || '').toLowerCase());

    return searchFields.some(field => field.includes(searchQuery.toLowerCase()));
  });

  // Computed paginated users
  $: paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total pages
  $: totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
</script>

<div class="overflow-x-auto bg-gray-800 rounded-2xl shadow-xl p-6">
  <input type="text" placeholder="Search..." bind:value={searchQuery} class="mb-4 p-2 border border-gray-600 rounded bg-gray-700 text-white" />
  {#if loading && employees.length === 0}
    <p class="text-center py-4 text-white">Loading employees...</p>
  {:else}
    <table class="min-w-full">
      <thead>
        <tr class="border-b border-gray-600">
          <th class="px-4 py-2 text-left text-gray-300">FirstName</th>
          <th class="px-4 py-2 text-left text-gray-300">Middle Name</th>
          <th class="px-4 py-2 text-left text-gray-300">Last Name</th>
          <th class="px-4 py-2 text-left text-gray-300">Email</th>
          <th class="px-4 py-2 text-left text-gray-300">Age</th>
          <th class="px-4 py-2 text-left text-gray-300">Gender</th>
          <th class="px-4 py-2 text-left text-gray-300">Contact Number</th>
          <th class="px-4 py-2 text-left text-gray-300">Address</th>
          <th class="px-4 py-2 text-left text-gray-300">Job</th>
          <th class="px-4 py-2 text-left text-gray-300">Department</th>
          <th class="px-4 py-2 text-left text-gray-300">Status</th>
          <th class="px-4 py-2 text-left text-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each paginatedEmployees as employeess}
          <tr class="border-b border-gray-600 hover:bg-gray-700">
            <td class="px-4 py-2 text-white">{employeess.firstname|| '-'}</td>
            <td class="px-4 py-2 text-white">{employeess.middlename || '-'}</td>
            <td class="px-4 py-2 text-white">{employeess.lastname || '-'}</td>
            <td class="px-4 py-2 text-white">{employeess.email || '-'}</td>
            <td class="px-4 py-2 text-white">{employeess.age || '-'}</td>
            <td class="px-4 py-2 text-white">{employeess.gender || '-'}</td>
            <td class="px-4 py-2 text-white">{employeess.contactnumber || '-'}</td>
            <td class="px-4 py-2 text-white">{employeess.address || '-'}</td>
            <td class="px-4 py-2 text-white">{employeess.job || '-'}</td>
            <td class="px-4 py-2 text-white">{employeess.department || '-'}</td>
            <td class="px-4 py-2 text-white">{employeess.status}</td>
            <td class="px-4 py-2 flex gap-2">
              <button
                on:click={() => setEditEmployee(employeess)}
                class="text-blue-400 hover:text-blue-300"
              >
                Edit
              </button>
              <button
                on:click={() => deleteEmployee(employeess.id)}
                class="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="flex justify-between mt-4">
      <button on:click={() => currentPage = Math.max(currentPage - 1, 1)} disabled={currentPage === 1} class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50">
        Previous
      </button>
      <span class="text-gray-300">Page {currentPage} of {totalPages}</span>
      <button on:click={() => currentPage = Math.min(currentPage + 1, totalPages)} disabled={currentPage === totalPages} class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50">
        Next
      </button>
    </div>
  {/if}
</div>