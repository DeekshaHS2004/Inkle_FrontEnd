import React, { useEffect, useMemo, useState } from "react";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { fetchTaxes, fetchCountries, updateTax } from "../api";
import EditModal from "./EditModal";

const columnHelper = createColumnHelper();

export default function TaxTable() {
	const [data, setData] = useState([]);
	const [countries, setCountries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingRow, setEditingRow] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		Promise.all([fetchTaxes(), fetchCountries()])
			.then(([taxes, countriesList]) => {
				if (!mounted) return;
				// normalize requestDate field if necessary
				const normalized = taxes.map((t) => ({
					...t,
					requestDate:
						t.requestDate || t.request_date || t.date || t.createdAt || "",
				}));
				setData(normalized);
				setCountries(countriesList);
			})
			.catch((e) => {
				console.error(e);
				setError("Failed to fetch data");
			})
			.finally(() => mounted && setLoading(false));
		return () => (mounted = false);
	}, []);

	const columns = useMemo(
		() => [
			columnHelper.accessor("entity", {
				header: "Entity",
				cell: (info) => info.getValue(),
			}),
			columnHelper.accessor("gender", {
				header: "Gender",
				cell: (info) => info.getValue(),
			}),
			columnHelper.accessor("requestDate", {
				header: "Request date",
				cell: (info) => {
					const v = info.getValue();
					if (!v) return "";
					try {
						const d = new Date(v);
						return isNaN(d) ? v : d.toLocaleDateString();
					} catch {
						return v;
					}
				},
			}),
			columnHelper.accessor("country", {
				header: "Country",
				cell: (info) => info.getValue(),
			}),
			columnHelper.display({
				id: "actions",
				header: " ",
				cell: ({ row }) => (
					<div className="actions">
						<button
							className="btn btn-small"
							onClick={() => setEditingRow(row.original)}
							aria-label="Edit row"
						>
							Edit
						</button>
					</div>
				),
			}),
		],
		[]
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	if (loading) return <div className="panel">Loading...</div>;
	if (error) return <div className="panel error">{error}</div>;

	async function onSave(updated) {
		// optimistic update (update local state after successful PUT)
		try {
			const saved = await updateTax(updated.id, updated);
			setData((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
			setEditingRow(null);
		} catch (e) {
			console.error(e);
			alert("Failed to save. See console.");
		}
	}

	return (
		<div className="panel">
			<div className="table-wrap">
				<table className="table">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{editingRow && (
				<EditModal
					row={editingRow}
					countries={countries}
					onClose={() => setEditingRow(null)}
					onSave={onSave}
				/>
			)}
		</div>
	);
}
