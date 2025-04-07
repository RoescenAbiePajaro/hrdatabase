<!-- src/lib/components/user/UserForm.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';

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

    export let editUser: User | null;
    export let handleSubmit: SubmitFunction;
</script>
  
<form use:enhance={handleSubmit} method="POST" action="/api/users" class="mb-6">
  <div class="grid grid-cols-1 gap-4 mb-4">
    <div>
      <label class="block text-gray-700 mb-2">First Name</label>
      <input
        name="firstname"
        type="text"
        value={editUser?.firstname || ''}
        required
        class="w-full px-3 py-2 border rounded"
      />
    </div>
    <div>
      <label class="block text-gray-700 mb-2">Middle Name</label>
      <input
        name="middlename"
        type="text"
        value={editUser?.middlename || ''}
        class="w-full px-3 py-2 border rounded"
      />
    </div>
    <div>
      <label class="block text-gray-700 mb-2">Last Name</label>
      <input
        name="lastname"
        type="text"
        value={editUser?.lastname || ''}
        required
        class="w-full px-3 py-2 border rounded"
      />
    </div>

     <div>
      <label class="block text-gray-700 mb-2">Gender</label>
      <input
        name="gender"
        type="text"
        value={editUser?.gender || ''}
        class="w-full px-3 py-2 border rounded"
      />
    </div>
    <div>
      <label class="block text-gray-700 mb-2">Email</label>
      <input
        name="email"
        type="email"
        value={editUser?.email || ''}
        required
        class="w-full px-3 py-2 border rounded"
      />
    </div>
   
    <div>
      <label class="block text-gray-700 mb-2">Contact Number</label>
      <input
        name="contactnumber"
        type="text"
        value={editUser?.contactnumber || ''}
        class="w-full px-3 py-2 border rounded"
      />
    </div>
    <div>
      <label class="block text-gray-700 mb-2">Address</label>
      <input
        name="address"
        type="text"
        value={editUser?.address || ''}
        class="w-full px-3 py-2 border rounded"
      />
    </div>
    <div>
      <label class="block text-gray-700 mb-2">Job</label>
      <input
        name="job"
        type="text"
        value={editUser?.job || ''}
        class="w-full px-3 py-2 border rounded"
      />
    </div>
    <div>
      <label class="block text-gray-700 mb-2">Department</label>
      <input
        name="department"
        type="text"
        value={editUser?.department || ''}
        class="w-full px-3 py-2 border rounded"
      />
    </div>
    <div>
      <label class="block text-gray-700 mb-2">Status</label>
      <input
        name="status"
        type="text"
        value={editUser?.status || ''}
        class="w-full px-3 py-2 border rounded"
      />
    </div>
  </div>

    <div>
      <label class="block text-gray-700 mb-2">Age</label>
      <input
        name="age"
        type="number"
        min="13"
        max="95"
        required
        value={editUser?.age || ''}
        class="w-full px-3 py-2 border rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  
  <div class="flex gap-2">
    <button
      type="submit"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      {editUser ? 'Update User' : 'Add User'}
    </button>
    {#if editUser}
      <button
        type="button"
        on:click={() => editUser = null}
        class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
    {/if}
  </div>
</form>