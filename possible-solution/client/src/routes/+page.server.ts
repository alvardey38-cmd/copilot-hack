export const API_BASE = 'http://localhost:5000';

const API_UNAVAILABLE_MESSAGE =
	'Could not reach the flight API on port 5000. Make sure the API server is running (python app.py in the server folder), then try again.';

export async function load({ fetch }) {
	try {
		const res = await fetch(`${API_BASE}/airports`);
		if (!res.ok) {
			throw new Error(`Airports request failed with status ${res.status}`);
		}
		const airports = await res.json();
		return { airports };
	} catch {
		return { airports: [], error: API_UNAVAILABLE_MESSAGE };
	}
}

export const actions = {
	getDelay: async ({ fetch, request }) => {
		// get form data
		const data = await request.formData();

		const day_of_week = data.get('day');
		const airport_id = data.get('airport');

		try {
			// make request to server
			const res = await fetch(
				`${API_BASE}/predict?day_of_week=${day_of_week}&airport_id=${airport_id}`
			);
			if (!res.ok) {
				throw new Error(`Prediction request failed with status ${res.status}`);
			}
			const result = await res.json();
			return { result };
		} catch {
			return { error: API_UNAVAILABLE_MESSAGE };
		}
	}
};
