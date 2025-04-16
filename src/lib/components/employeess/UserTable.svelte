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

<div class="overflow-x-auto">
  <input type="text" placeholder="Search employees..." bind:value={searchQuery} class="mb-4 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
  {#if loading && employees.length === 0}
    <p class="text-center py-4">Loading employees...</p>
  {:else}
    <table class="min-w-full bg-gray-800">
      <thead>
        <tr class="border-b border-gray-700">
          <th class="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">First Name</th>
          <th class="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Middle Name</th>
          <th class="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Last Name</th>
          <th class="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Email</th>
          <th class="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Age</th>
          <th class="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Gender</th>
          <th class="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Contact Number</th>
          <th class="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Address</th>
          <th class="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Job</th>
          <th class="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Department</th>
          <th class="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Status</th>
          <th class="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each paginatedEmployees as employeess}
          <tr class="border-b border-gray-700 hover:bg-gray-700">
            <td class="px-4 py-3 text-gray-300">{employeess.firstname|| '-'}</td>
            <td class="px-4 py-3 text-gray-300">{employeess.middlename || '-'}</td>
            <td class="px-4 py-3 text-gray-300">{employeess.lastname || '-'}</td>
            <td class="px-4 py-3 text-gray-300">{employeess.email || '-'}</td>
            <td class="px-4 py-3 text-gray-300">{employeess.age || '-'}</td>
            <td class="px-4 py-3 text-gray-300">{employeess.gender || '-'}</td>
            <td class="px-4 py-3 text-gray-300">{employeess.contactnumber || '-'}</td>
            <td class="px-4 py-3 text-gray-300">{employeess.address || '-'}</td>
            <td class="px-4 py-3 text-gray-300">{employeess.job || '-'}</td>
            <td class="px-4 py-3 text-gray-300">{employeess.department || '-'}</td>
            <td class="px-4 py-3 text-gray-300">{employeess.status}</td>
            <td class="px-4 py-3">
              <button
                on:click={() => setEditEmployee(employeess)}
                class="px-3 py-1.5 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
              >
                Edit
              </button>
              <button
                on:click={() => deleteEmployee(employeess.id)}
                class="px-3 py-1.5 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 ml-2"
              >
                Delete
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="flex justify-between items-center mt-4">
      <button on:click={() => currentPage = Math.max(currentPage - 1, 1)} disabled={currentPage === 1} class="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        Previous
      </button>
      <span class="text-gray-400">Page {currentPage} of {totalPages}</span>
      <button on:click={() => currentPage = Math.min(currentPage + 1, totalPages)} disabled={currentPage === totalPages} class="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        Next
      </button>
    </div>
  {/if}
</div>