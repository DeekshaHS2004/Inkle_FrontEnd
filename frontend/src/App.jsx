import React from "react";
import TaxTable from "./components/TaxTable";

export default function App() {
	return (
		<div className="app">
			<header className="header">
				<h1>Customers / Taxes — Inkle Assignment</h1>
			</header>

			<main className="container">
				<TaxTable />
			</main>

			<footer className="footer">
				<small>Built with React + tanstack/table — demo</small>
			</footer>
		</div>
	);
}
