<!-- src/lib/components/user/UserForm.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';

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

    // Department and role data
    const departments = [
      {
        name: 'Human Resources (HR)',
        roles: [
          'HR Generalist',
          'Recruiter / Talent Acquisition Specialist',
          'Payroll & Benefits Administrator',
          'HR Coordinator',
          'Training & Development Specialist'
        ]
      },
      {
        name: 'Operations',
        roles: [
          'Operations Manager',
          'Project Manager',
          'Logistics Coordinator',
          'Office Manager',
          'Customer Support Representative'
        ]
      },
      {
        name: 'Sales & Marketing',
        roles: [
          'Sales Representative',
          'Account Manager',
          'Marketing Specialist',
          'Business Development Manager',
          'Content Creator / Copywriter'
        ]
      },
      {
        name: 'Finance & Accounting',
        roles: [
          'Accountant',
          'Financial Analyst',
          'Accounts Payable/Receivable Clerk',
          'CFO'
        ]
      },
      {
        name: 'IT / Technical Team',
        roles: [
          'Software Developer / Engineer',
          'IT Support Specialist',
          'Systems Administrator',
          'Data Analyst',
          'Product Manager'
        ]
      }
    ];

    export let editEmployee: Employee | null;
    export let handleSubmit: SubmitFunction;

    // Initialize department and job based on existing values
    let selectedDepartment = editEmployee?.department || '';
    let selectedJob = editEmployee?.job || '';

    // Update job options when department changes
    $: availableRoles = departments.find(d => d.name === selectedDepartment)?.roles || [];

    // Update job when department changes
    $: if (selectedDepartment && !availableRoles.includes(selectedJob)) {
        selectedJob = availableRoles[0] || '';
      }
</script>
  
<form use:enhance={handleSubmit} method="POST" action="/api/employees" class="mb-6">
  <div class="grid grid-cols-1 gap-4 mb-4">
    <div>
      <label class="block text-gray-700 mb-2">First Name</label>
      <input
        name="firstname"
        type="text"
        value={editEmployee?.firstname || ''}
        required
        class="w-full px-3 py-2 border rounded"
      />
    </div>
    <div>
      <label class="block text-gray-700 mb-2">Middle Name</label>
      <input
        name="middlename"
        type="text"
        value={editEmployee?.middlename || ''}
        class="w-full px-3 py-2 border rounded"
      />
    </div>
    <div>
      <label class="block text-gray-700 mb-2">Last Name</label>
      <input
        name="lastname"
        type="text"
        value={editEmployee?.lastname || ''}
        required
        class="w-full px-3 py-2 border rounded"
      />
    </div>

     <div>
      <label class="block text-gray-700 mb-2">Gender</label>
      <select
        name="gender"
        class="w-full px-3 py-2 border rounded"
      >
        <option value="" disabled selected={!editEmployee?.gender}>Select Gender</option>
        <option value="Male" selected={editEmployee?.gender === 'Male'}>Male</option>
        <option value="Female" selected={editEmployee?.gender === 'Female'}>Female</option>
      </select>
    </div>
    <div>
      <label class="block text-gray-700 mb-2">Email</label>
      <input
        name="email"
        type="email"
        value={editEmployee?.email || ''}
        required
        class="w-full px-3 py-2 border rounded"
      />
    </div>
   
    <div>
      <label class="block text-gray-700 mb-2">Contact Number</label>
      <input
        name="contactnumber"
        type="text"
        value={editEmployee?.contactnumber || ''}
        class="w-full px-3 py-2 border rounded"
      />
    </div>
    <div>
      <label class="block text-gray-700 mb-2">Address</label>
      <input
        name="address"
        type="text"
        value={editEmployee?.address || ''}
        class="w-full px-3 py-2 border rounded"
      />
    </div>
    <div>
      <label class="block text-gray-700 mb-2">Department</label>
      <select
        name="department"
        bind:value={selectedDepartment}
        class="w-full px-3 py-2 border rounded"
        required
      >
        <option value="" disabled selected={!selectedDepartment}>Select Department</option>
        {#each departments as dept}
          <option value={dept.name} selected={dept.name === selectedDepartment}>{dept.name}</option>
        {/each}
      </select>
    </div>
    <div>
      <label class="block text-gray-700 mb-2">Job Role</label>
      <select
        name="job"
        bind:value={selectedJob}
        class="w-full px-3 py-2 border rounded"
        required
      >
        <option value="" disabled selected={!selectedJob}>Select Job Role</option>
        {#each availableRoles as role}
          <option value={role} selected={role === selectedJob}>{role}</option>
        {/each}
      </select>
    </div>
    <div>
      <label class="block text-gray-700 mb-2">Status</label>
      <select
        name="status"
        class="w-full px-3 py-2 border rounded"
      >
        <option value="active" selected={editEmployee?.status === 'active'}>Active</option>
        <option value="inactive" selected={editEmployee?.status === 'inactive'}>Inactive</option>
      </select>
    </div>
  </div>

    <div>
      <label class="block text-gray-700 mb-2">Age</label>
      <input
        name="age"
        type="number"
        min="18"
        max="35"
        required
        value={editEmployee?.age || ''}
        class="w-full px-3 py-2 border rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  
  <div class="flex gap-2">
    <button
      type="submit"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      {editEmployee ? 'Update Employee' : 'Add Employee'}
    </button>
    {#if editEmployee}
      <button
        type="button"
        on:click={() => editEmployee = null}
        class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
    {/if}
  </div>
</form>