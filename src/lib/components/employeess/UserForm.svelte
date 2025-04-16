<!-- src/lib/components/user/UserForm.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { departments } from '$lib/stores/departmentStore';

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

  export let editEmployee: Employee | null;
  export let handleSubmit: SubmitFunction;

  let selectedDepartment = editEmployee?.department || '';
  let selectedJob = editEmployee?.job || '';

  $: availableJobs = $departments.find(d => d.name === selectedDepartment)?.jobs || [];
</script>

<form use:enhance={handleSubmit} method="POST" action="/api/employees" class="bg-gray-800 rounded-lg p-6">
  <div class="grid grid-cols-1 gap-6">
    <div>
      <label class="block text-gray-400 mb-2" for="firstname">First Name</label>
      <input
        id="firstname"
        name="firstname"
        type="text"
        value={editEmployee?.firstname || ''}
        required
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-gray-400 mb-2" for="middlename">Middle Name</label>
      <input
        id="middlename"
        name="middlename"
        type="text"
        value={editEmployee?.middlename || ''}
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-gray-400 mb-2" for="lastname">Last Name</label>
      <input
        id="lastname"
        name="lastname"
        type="text"
        value={editEmployee?.lastname || ''}
        required
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label class="block text-gray-400 mb-2" for="gender">Gender</label>
      <select
        id="gender"
        name="gender"
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled selected={!editEmployee?.gender}>Select Gender</option>
        <option value="Male" selected={editEmployee?.gender === 'Male'}>Male</option>
        <option value="Female" selected={editEmployee?.gender === 'Female'}>Female</option>
      </select>
    </div>
    <div>
      <label class="block text-gray-400 mb-2" for="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={editEmployee?.email || ''}
        required
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label class="block text-gray-400 mb-2" for="contactnumber">Contact Number</label>
      <input
        id="contactnumber"
        name="contactnumber"
        type="text"
        value={editEmployee?.contactnumber || ''}
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-gray-400 mb-2" for="address">Address</label>
      <input
        id="address"
        name="address"
        type="text"
        value={editEmployee?.address || ''}
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-gray-400 mb-2" for="department">Department</label>
      <select
        id="department"
        name="department"
        bind:value={selectedDepartment}
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled selected={!selectedDepartment}>Select Department</option>
        {#each $departments as dept}
          <option value={dept.name} selected={dept.name === selectedDepartment}>{dept.name}</option>
        {/each}
      </select>
    </div>
    <div>
      <label class="block text-gray-400 mb-2" for="job">Job</label>
      <select
        id="job"
        name="job"
        bind:value={selectedJob}
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled selected={!selectedJob}>Select Job</option>
        {#each availableJobs as job}
          <option value={job} selected={job === selectedJob}>{job}</option>
        {/each}
      </select>
    </div>
    <div>
      <label class="block text-gray-400 mb-2" for="status">Status</label>
      <select
        id="status"
        name="status"
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="active" selected={editEmployee?.status === 'active'}>Active</option>
        <option value="inactive" selected={editEmployee?.status === 'inactive'}>Inactive</option>
      </select>
    </div>
    <div>
      <label class="block text-gray-400 mb-2" for="age">Age</label>
      <input
        id="age"
        name="age"
        type="number"
        min="18"
        max="35"
        required
        value={editEmployee?.age || ''}
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  </div>

  <div class="flex justify-end gap-4 mt-6">
    <button
      type="submit"
      class="px-6 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-colors duration-200"
    >
      {editEmployee ? 'Update Employee' : 'Add Employee'}
    </button>
    {#if editEmployee}
      <button
        type="button"
        on:click={() => editEmployee = null}
        class="px-6 py-3 text-sm font-medium rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
      >
        Cancel
      </button>
    {/if}
  </div>
</form>