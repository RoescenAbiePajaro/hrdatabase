<!-- src/lib/components/user/AnalysisPanel.svelte -->
<script lang="ts">
  export let loading: boolean;
  export let employees: any[];
  export let generateSummary: () => Promise<void>;
  export let customPrompt: string;
  export let stats: any;
  export let summ: string;
</script>

<div class="bg-gray-800 rounded-2xl shadow-xl p-6">
  <h2 class="text-xl font-semibold mb-4 text-white">AI Analysis</h2>
  
  <div class="mb-4">
    <label class="block text-gray-300 mb-2">Custom Prompt (optional):</label>
    <textarea
      bind:value={customPrompt}
      class="w-full px-3 py-2 border border-gray-600 rounded h-24 bg-gray-700 text-white"
      placeholder="E.g., 'Analyze age distribution and highlight key patterns'"
    />
  </div>
  
  <button
    on:click={generateSummary}
    disabled={loading || employees.length === 0}
    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4 disabled:bg-gray-600 disabled:text-gray-400"
  >
    {loading ? 'Generating...' : 'Generate Summary'}
  </button>

  {#if stats}
    <div class="mb-6">
      <h3 class="font-semibold mb-2 text-white">Quick Stats:</h3>
      <ul class="grid grid-cols-2 gap-2 mb-2">
        <li class="bg-gray-700 p-2 rounded text-white">Total Employees: {stats.totalEmployees}</li>
        <li class="bg-gray-50 p-2 rounded">Total Employees: {stats.totalEmployees}</li>
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

  {#if summ}
    <div>
      <h3 class="font-semibold mb-2">AI Summary:</h3>
      <div class="bg-gray-50 p-4 rounded whitespace-pre-wrap markdown">
        {@html summ.replace(/\n/g, '<br>')}
      </div>
    </div>
  {/if}
</div>