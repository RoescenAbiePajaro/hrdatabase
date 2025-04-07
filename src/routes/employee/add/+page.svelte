<script lang="ts">
  import { enhance } from '$app/forms';
  import UserForm from '$lib/components/user/UserForm.svelte';

  let editEmployee = null;

  async function handleSubmit(event) {
    const formData = await event.request.formData();
    
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to add employee');
      }

      // Redirect to employee list after successful addition
      return {
        status: 303,
        headers: {
          location: '/employee'
        }
      };
    } catch (error) {
      console.error('Error adding employee:', error);
      // Handle error as needed
    }
  }
</script>

<main class="container mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">Add New Employee</h1>
  
  <UserForm
    {editEmployee}
    {handleSubmit}
  />
</main>