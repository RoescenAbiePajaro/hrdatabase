<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import UserTable from '$lib/components/user/UserTable.svelte';

  let loading = true;
  let employees = [];
  let editEmployee = null;
  let selectedEmployeeIds = [];

  // Functions to handle employee actions
  async function fetchEmployees() {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      employees = await response.json();
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      loading = false;
    }
  }

  function setEditEmployee(employee) {
    editEmployee = employee;
    // You might want to navigate to the edit page here
    // window.location.href = `/employee/edit/${employee.id}`;
  }

  async function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      // Remove the deleted employee from the list
      employees = employees.filter(emp => emp.id !== id);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }

  function toggleEmployeeSelection(id) {
    if (selectedEmployeeIds.includes(id)) {
      selectedEmployeeIds = selectedEmployeeIds.filter(selectedId => selectedId !== id);
    } else {
      selectedEmployeeIds = [...selectedEmployeeIds, id];
    }
  }

  onMount(() => {
    fetchEmployees();
  });
</script>

<main class="container mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">Employee Information</h1>
  
  <UserTable
    {employees}
    {loading}
    {selectedEmployeeIds}
    {editEmployee}
    {setEditEmployee}
    {deleteEmployee}
    {toggleEmployeeSelection}
  />
</main>