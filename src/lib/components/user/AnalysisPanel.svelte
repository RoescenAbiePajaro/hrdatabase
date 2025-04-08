<!-- src/lib/components/user/AnalysisPanel.svelte -->
<script lang="ts">
  export let loading: boolean;
  export let users: any[];
  export let generateSummary: () => Promise<void>;
  export let customPrompt: string;
  export let stats: any;
  export let summary: string;
</script>

<div class="bg-white rounded-lg shadow p-6">
  <h2 class="text-xl font-semibold mb-4 text-gray-700">AI Analysis</h2>
  
  <div class="mb-4">
    <label class="block text-gray-700 mb-2">Custom Prompt (optional):</label>
    <textarea
      bind:value={customPrompt}
      class="w-full px-3 py-2 border rounded h-24"
      placeholder="E.g., 'Analyze age distribution and highlight key patterns'"
    />
  </div>
  
  <button
    on:click={generateSummary}
    disabled={loading || users.length === 0}
    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-4 disabled:bg-gray-400"
  >
    {loading ? 'Generating...' : 'Generate Summary'}
  </button>

  {#if stats}
    <div class="mb-6">
      <h3 class="font-semibold mb-2">Quick Stats:</h3>
      <ul class="grid grid-cols-2 gap-2 mb-2">
        <li class="bg-gray-50 p-2 rounded">Total Users: {stats.totalUsers}</li>
        {#if stats.averageAge}
          <li class="bg-gray-50 p-2 rounded">Avg Age: {stats.averageAge.toFixed(1)}</li>
          <li class="bg-gray-50 p-2 rounded">
            Age Range: {stats.ageRange.min}-{stats.ageRange.max}
          </li>
        {/if}
      </ul>
      {#if stats.domains.length > 0}
        <div>
          <h4 class="font-medium mb-1">Email Domains:</h4>
          <ul class="flex flex-wrap gap-2">
            {#each stats.domains as { domain, count }}
              <li class="bg-gray-50 p-2 rounded">{domain} ({count})</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  {/if}

  {#if summary}
    <div>
      <h3 class="font-semibold mb-2">AI Summary:</h3>
      <div class="bg-gray-50 p-4 rounded whitespace-pre-wrap markdown">
        {@html summary.replace(/\n/g, '<br>')}
      </div>
    </div>
  {/if}
</div>