<!-- src/lib/components/user/UserForm.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { departments } from '$lib/stores/departmentStore';
  import { onMount } from 'svelte';

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

  let formState: Employee = {
    id: editEmployee?.id || 0,
    firstname: editEmployee?.firstname || '',
    middlename: editEmployee?.middlename || '',
    lastname: editEmployee?.lastname || '',
    gender: editEmployee?.gender || '',
    contactnumber: editEmployee?.contactnumber || '',
    address: editEmployee?.address || '',
    job: editEmployee?.job || '',
    department: editEmployee?.department || '',
    status: editEmployee?.status || 'active',
    email: editEmployee?.email || '',
    age: editEmployee?.age || null
  };

  let selectedDepartment = formState.department;
  let selectedJob = formState.job;

  $: availableJobs = $departments.find(d => d.name === selectedDepartment)?.jobs || [];

  // Reset form when editEmployee changes
  $: if (editEmployee) {
    formState = {
      id: editEmployee.id,
      firstname: editEmployee.firstname,
      middlename: editEmployee.middlename,
      lastname: editEmployee.lastname,
      gender: editEmployee.gender,
      contactnumber: editEmployee.contactnumber,
      address: editEmployee.address,
      job: editEmployee.job,
      department: editEmployee.department,
      status: editEmployee.status,
      email: editEmployee.email,
      age: editEmployee.age
    };
    selectedDepartment = formState.department;
    selectedJob = formState.job;
  } else {
    formState = {
      id: 0,
      firstname: '',
      middlename: '',
      lastname: '',
      gender: '',
      contactnumber: '',
      address: '',
      job: '',
      department: '',
      status: 'active',
      email: '',
      age: null
    };
    selectedDepartment = '';
    selectedJob = '';
  }

  async function handleFormSubmit(e: SubmitEvent) {
    const formData = new FormData(e.target as HTMLFormElement);
    await handleSubmit({
      action: new URL(window.location.href),
      formData,
      formElement: e.target as HTMLFormElement,
      controller: new AbortController(),
      submitter: e.submitter,
      cancel: () => {}
    });
  }
</script>

<form on:submit={handleFormSubmit} class="bg-gray-800 rounded-lg p-6">
  <div class="grid grid-cols-1 gap-6">
    <div>
      <label class="block text-gray-400 mb-2" for="firstname">First Name</label>
      <input
        id="firstname"
        name="firstname"
        type="text"
        value={formState.firstname}
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
        value={formState.middlename}
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-gray-400 mb-2" for="lastname">Last Name</label>
      <input
        id="lastname"
        name="lastname"
        type="text"
        value={formState.lastname}
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
        <option value="" disabled selected={!formState.gender}>Select Gender</option>
        <option value="Male" selected={formState.gender === 'Male'}>Male</option>
        <option value="Female" selected={formState.gender === 'Female'}>Female</option>
      </select>
    </div>
    <div>
      <label class="block text-gray-400 mb-2" for="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={formState.email}
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
        value={formState.contactnumber}
        class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-gray-400 mb-2" for="address">Address</label>
      <input
        id="address"
        name="address"
        type="text"
        value={formState.address}
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
        value={formState.age}
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
        on:click={() => {
          editEmployee = null;
          // Reset form values
          const form = document.querySelector('form');
          if (form) {
            form.reset();
          }
          // Reset bound values
          selectedDepartment = '';
          selectedJob = '';
          // Emit cancel event to parent
          const event = new CustomEvent('cancel', { bubbles: true });
          document.dispatchEvent(event);
        }}
        class="px-6 py-3 text-sm font-medium rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
      >
        Cancel
      </button>
    {/if}
  </div>
</form>