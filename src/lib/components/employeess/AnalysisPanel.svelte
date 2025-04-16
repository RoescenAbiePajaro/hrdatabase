<!-- src/lib/components/user/AnalysisPanel.svelte -->
<script lang="ts">
  export let loading: boolean;
  export let employees: any[];
  export let generateSummary: () => Promise<void>;
  export let customPrompt: string;
  export let stats: any;
  export let summ: string;
</script>

<div class="bg-gray-800 rounded-lg p-6">
  <h2 class="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">AI Analysis</h2>
  
  <div class="mb-6">
    <label class="block text-gray-400 mb-2" for="analysis-prompt">Custom Prompt (optional):</label>
    <textarea
      id="analysis-prompt"
      bind:value={customPrompt}
      class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
      placeholder="E.g., 'Analyze age distribution and highlight key patterns'"
    ></textarea>
  </div>
  
  <button
    on:click={generateSummary}
    disabled={loading || employees.length === 0}
    class="w-full px-6 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600"
  >
    {loading ? 'Generating...' : 'Generate Summary'}
  </button>

  {#if stats}
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-4 text-gray-300">Quick Stats:</h3>
      <ul class="grid grid-cols-2 gap-4 mb-4">
        <li class="bg-gray-700 p-3 rounded-lg border border-gray-600">Total Employees: {stats.totalEmployees}</li>
        {#if stats.averageAge}
          <li class="bg-gray-700 p-3 rounded-lg border border-gray-600">Avg Age: {stats.averageAge.toFixed(1)}</li>
          <li class="bg-gray-700 p-3 rounded-lg border border-gray-600">
            Age Range: {stats.ageRange.min}-{stats.ageRange.max}
          </li>
        {/if}
      </ul>
      {#if stats.domains.length > 0}
        <div>
          <h4 class="text-gray-400 mb-3">Email Domains:</h4>
          <ul class="flex flex-wrap gap-3">
            {#each stats.domains as { domain, count }}
              <li class="bg-gray-700 p-2 rounded-lg border border-gray-600">{domain} ({count})</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  {/if}

  {#if summ}
    <div>
      <h3 class="text-lg font-semibold mb-4 text-gray-300">AI Summary:</h3>
      <div class="bg-gray-700 p-5 rounded-lg border border-gray-600 whitespace-pre-wrap markdown">
        {@html summ.replace(/\n/g, '<br>')}
      </div>
    </div>
  {/if}
</div>