import axios from "axios";

const BASE = "https://685013d7e7c42cfd17974a33.mockapi.io";

export async function fetchTaxes() {
	const res = await axios.get(`${BASE}/taxes`);
	return res.data;
}

export async function fetchCountries() {
	const res = await axios.get(`${BASE}/countries`);
	return res.data;
}

export async function updateTax(id, payload) {
	const res = await axios.put(`${BASE}/taxes/${id}`, payload);
	return res.data;
}
