<script lang="ts">
    import { goto } from '$app/navigation';
    
    const menuItems = [
        { label: 'Dashboard', icon: '🏠', path: '../employee/dashboard' },
        { label: 'Add/New Employee', icon: '📝', path: '../employee/add' },
        { label: 'Employee Info', icon: '📊', path: '../employee/info' },
        { label: 'AI Analysis', icon: '📊', path: '../employee/analysis' }
    ];

    function navigate(path: string) {
        goto(path);
    }
</script>

<div class="sidebar">
    <div class="logo">
        <h2>HR Dashboard</h2>
    </div>
    
    <nav class="menu">
        {#each menuItems as item}
            <button 
                class="menu-item" 
                on:click={() => navigate(item.path)}
                aria-label={item.label}
            >
                <span class="icon">{item.icon}</span>
                <span class="label">{item.label}</span>
            </button>
        {/each}
    </nav>
</div>

<style>
    .sidebar {
        width: 250px;
        min-height: 100vh;
        background: #2c3e50;
        color: white;
        padding: 20px;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1000;
    }

    .logo {
        padding: 20px 0;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo h2 {
        margin: 0;
        font-size: 1.5rem;
    }

    .menu {
        margin-top: 20px;
    }

    .menu-item {
        width: 100%;
        padding: 12px;
        margin: 4px 0;
        border: none;
        background: none;
        color: white;
        text-align: left;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        border-radius: 8px;
        transition: background-color 0.2s;
    }

    .menu-item:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .icon {
        font-size: 1.2rem;
    }

    .label {
        font-size: 0.9rem;
    }
</style>
