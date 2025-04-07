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
    export let setEditEmployee: (employee: Employee) => void;
    export let deleteEmployee: (id: number) => void;
    export let toggleEmployeeSelection: (id: number) => void;

    // New state for search and pagination
    let searchQuery = '';
    let currentPage = 1;
    const itemsPerPage = 5;

    // Computed filtered employees based on search query
    $: filteredEmployees = employees.filter(employee =>
      (employee.firstname + ' ' + (employee.middlename || '') + ' ' + (employee.lastname || '')).toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Computed paginated employees
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
          {#each paginatedEmployees as employee}
            <tr class="border-b hover:bg-gray-50">
              <td class="px-4 py-2">{employee.firstname} {employee.middlename ? employee.middlename + ' ' : ''}{employee.lastname}</td>
              <td class="px-4 py-2">{employee.email}</td>
              <td class="px-4 py-2">{employee.age || '-'}</td>
              <td class="px-4 py-2">{employee.gender || '-'}</td>
              <td class="px-4 py-2">{employee.contactnumber || '-'}</td>
              <td class="px-4 py-2">{employee.address || '-'}</td>
              <td class="px-4 py-2">{employee.job || '-'}</td>
              <td class="px-4 py-2">{employee.department || '-'}</td>
              <td class="px-4 py-2">{employee.status}</td>
              <td class="px-4 py-2 flex gap-2">
                <button
                  on:click={() => setEditEmployee(employee)}
                  class="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  on:click={() => deleteEmployee(employee.id)}
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