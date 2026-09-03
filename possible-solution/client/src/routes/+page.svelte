<script lang="ts">
    import type { Airport } from "$lib";
    export let data;

    export let form;

    const airports: Airport[] = data.airports ?? [];

    // create an array of days for display
    // include the name starting with Monday and a value of 1
    // end with Sunday as 7
    const days = Array.from({length: 7}, (_, i) => {
        return {
            name: new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(new Date(0, 0, i + 1)),
            value: i + 1
        }
    });
</script>

<svelte:head>
    <title>Flight delay predictor</title>
    <meta name="description" content="See the chance a flight will be delayed more than 15 minutes, based on arrival airport and day of the week." />
</svelte:head>

<h1>Flight delay predictor</h1>
<p>Select an arrival airport and a day of the week to see the chance your flight will be delayed by more than 15 minutes.</p>

{#if data.error || form?.error}
    <div class="error" role="alert">
        {data.error || form?.error}
    </div>
{/if}

<form method="POST" action="?/getDelay">

    <label for="airport">Arrival airport</label>
    <select id="airport" name="airport" required>
        <option value="" disabled selected>Select an airport…</option>
        {#each airports as airport (airport.id)}
            <option value={airport.id}>{airport.name}</option>
        {/each}
    </select>

    <label for="day">Day of the week</label>
    <select id="day" name="day" required>
        <option value="" disabled selected>Select a day…</option>
        {#each days as day (day.value)}
            <option value={day.value}>{day.name}</option>
        {/each}
    </select>

    <button type="submit">Find delay</button>
</form>

{#if form && form.result}
    <div class="result" role="status" aria-live="polite">
        <p>There is a <strong>{Math.round(form.result.delay * 100)}%</strong> chance of a delay of more than 15 minutes.</p>
        <p>There is a <strong>{Math.round(form.result.certainty * 100)}%</strong> chance of arriving on time.</p>
    </div>
{/if}
