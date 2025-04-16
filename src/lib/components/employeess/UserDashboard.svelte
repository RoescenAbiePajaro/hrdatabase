<!-- src/lib/components/user/UserDashboard.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  import UserForm from './UserForm.svelte';
  import UserTable from './UserTable.svelte';
  import AnalysisPanel from './AnalysisPanel.svelte';
  
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

  interface Stats {
    totalEmployees: number;
    withAgeData: number;
    averageAge: number | null;
    ageRange: { min: number; max: number } | null;
    domains: Array<{ domain: string; count: number }>;
  }
  
  let employees: Employee[] = [];
  let loading = false;
  let summ = '';
  let selectedEmployeeIds: number[] = [];
  let customPrompt = '';
  let stats: Stats | null = null;
  let error = '';
  let editEmployee: Employee | null = null;
  let activeTab = 'management';
  
  async function fetchEmployees() {
    loading = true;
    error = '';
    try {
      const res = await fetch('/api/employees');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch employees');
      }
      employees = await res.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load employees';
      console.error('Error fetching employees:', err);
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    fetchEmployees();
  });
  
  function toggleEmployeeSelection(id: number) {
    selectedEmployeeIds = selectedEmployeeIds.includes(id)
      ? selectedEmployeeIds.filter(i => i !== id)
      : [...selectedEmployeeIds, id];
  }
  
  async function generateSummary() {
    loading = true;
    error = '';
    try {
      const requestBody = {
        employeessIds: selectedEmployeeIds,
        prompt: customPrompt
      };
      console.log('Sending request body:', requestBody);
      
      const res = await fetch('http://localhost:5173/api/summ', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Summary generation failed');
      }
      const data = await res.json();
      summ = data.summ;
      stats = data.stats;
    } catch (err) {
      console.error('Summary generation error:', err);
      error = err instanceof Error ? err.message : 'Summary generation failed';
    } finally {
      loading = false;
    }
  }
  
  async function handleSubmit(event: { formElement: HTMLFormElement }) {
    const form = event.formElement;
    const data = new FormData(form);
    const method = editEmployee ? 'PUT' : 'POST';
    
    const body = JSON.stringify({
      id: editEmployee?.id,
      firstname: data.get('firstname') as string,
      middlename: data.get('middlename') as string | null,
      lastname: data.get('lastname') as string | null,
      gender: data.get('gender') as string | null,
      contactnumber: data.get('contactnumber') as string | null,
      address: data.get('address') as string | null,
      job: data.get('job') as string | null,
      department: data.get('department') as string | null,
      status: data.get('status') as 'active' | 'inactive',
      email: data.get('email') as string,
      age: parseInt(data.get('age') as string) || null
    });

    try {
      const endpoint = editEmployee ? `/api/employees/${editEmployee.id}` : '/api/employees';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || (method === 'POST' ? 'Creation failed' : 'Update failed'));
      }
      
      await fetchEmployees();
      editEmployee = null;
      form.reset();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Operation failed';
    }
  }
  
  async function deleteEmployee(id: number) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      const res = await fetch('http://localhost:5173/api/employees', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!res.ok) throw new Error('Deletion failed');
      await fetchEmployees();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Deletion failed';
    }
  }

  function setEditEmployee(employeess: Employee) {
    editEmployee = employeess;
    activeTab = 'form';
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI-Powered HR Management System</h1>
      <div class="flex items-center space-x-4">
        <button 
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          on:click={() => activeTab = 'form'}
        >
          Add Employee
        </button>
      </div>
    </div>

    {#if error}
      <div class="bg-red-900 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
        <p class="text-red-300">{error}</p>
      </div>
    {/if}

    <!-- Tab Navigation -->
    <div class="mb-8">
      <nav class="flex space-x-4" aria-label="Tabs">
        <button
          class="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200
            {activeTab === 'management' ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}"
          on:click={() => activeTab = 'management'}
        >
          Employee Management
        </button>
        <button
          class="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200
            {activeTab === 'analysis' ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}"
          on:click={() => activeTab = 'analysis'}
        >
          Analysis & Insights
        </button>
        <button
          class="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200
            {activeTab === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}"
          on:click={() => activeTab = 'form'}
        >
          Employee Form
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    {#if activeTab === 'management'}
      <div class="bg-gray-800 rounded-2xl shadow-xl p-8">
        <UserTable 
          {employees} 
          {loading} 
          {selectedEmployeeIds} 
          {toggleEmployeeSelection}
          {editEmployee}
          setEditEmployee={setEditEmployee}
          {deleteEmployee}
        />
      </div>
    {/if}

    {#if activeTab === 'analysis'}
      <div class="bg-gray-800 rounded-2xl shadow-xl p-8">
        <AnalysisPanel
          {loading}
          {employees}
          {generateSummary}
          {customPrompt}
          {stats}
          {summ}
        />
      </div>
    {/if}

    {#if activeTab === 'form'}
      <div class="bg-gray-800 rounded-2xl shadow-xl p-8">
        <UserForm {editEmployee} {handleSubmit} />
      </div>
    {/if}
  </div>
</div>

<style>
  .markdown ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 0.5rem 0;
  }
  .markdown ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin: 0.5rem 0;
  }
  .markdown strong {
    font-weight: bold;
  }
  .markdown em {
    font-style: italic;
  }
</style>