<script lang="ts">
    import '../app.css';
    import Sidebar from '$lib/components/user/Sidebar.svelte';

    let { children } = $props();
</script>

<div class="layout-container">
    <Sidebar />
    <main class="main-content">
        {@render children()}
    </main>
</div>

<style>
    .layout-container {
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
