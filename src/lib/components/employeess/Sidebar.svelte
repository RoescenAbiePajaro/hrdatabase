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
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 24px;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1000;
    }

    .logo {
        padding: 24px 0;
        text-align: center;
        border-bottom: 1px solid var(--border);
    }

    .logo h2 {
        font-size: 1.5rem;
        color: var(--text-primary);
        margin: 0;
        font-weight: 600;
    }

    .menu {
        margin-top: 32px;
    }

    .menu-item {
        width: 100%;
        padding: 16px;
        margin: 12px 0;
        border: none;
        background: none;
        color: var(--text-primary);
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        border-radius: 12px;
        transition: all 0.3s ease;
        text-align: left;
    }

    .menu-item:hover {
        background: var(--bg-hover);
        transform: translateX(4px);
    }

    .icon {
        font-size: 1.2rem;
        margin-right: 16px;
        width: 24px;
        text-align: center;
    }

    .label {
        font-weight: 500;
    }

    /* Dark Theme Variables */
    :global(.dark) {
        --bg-primary: #1a1a1a;
        --text-primary: #ffffff;
        --border: #404040;
    }

    /* Light Theme Variables */
    :global(.light) {
        --bg-primary: #ffffff;
        --text-primary: #212529;
        --border: #e9ecef;
    }
</style>
