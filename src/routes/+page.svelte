<!-- src/routes/+page.svelte -->
<script lang="ts">
    import UserDashboard from '$lib/components/user/UserDashboard.svelte';
    import Sidebar from '$lib/components/user/Sidebar.svelte';
</script>

<div class="app-container">
    <Sidebar />
    <main class="main-content">
        {@render children()}
    </main>
</div>

<style>
    .app-container {
        display: flex;
        min-height: 100vh;
    }

    .main-content {
        flex: 1;
        margin-left: 250px;
        padding: 20px;
        background: #f5f6fa;
    }
</style>