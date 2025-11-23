import React, { useEffect, useState } from "react";

export default function EditModal({ row, countries = [], onClose, onSave }) {
	// row corresponds to a tax object returned by API
	const [name, setName] = useState(row.entity || "");
	const [country, setCountry] = useState(row.country || "");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		setName(row.entity || "");
		setCountry(row.country || "");
	}, [row]);

	async function handleSave(e) {
		e.preventDefault();
		setSaving(true);
		const payload = {
			...row,
			entity: name,
			country: country,
		};

		try {
			await onSave(payload);
		} catch (err) {
			console.error(err);
			alert("Save failed");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="modal-backdrop" role="dialog" aria-modal="true">
			<div className="modal">
				<div className="modal-header">
					<h3>Edit Customer</h3>
					<button className="close-btn" onClick={onClose} title="Close">
						×
					</button>
				</div>

				<form className="modal-body" onSubmit={handleSave}>
					<label className="form-row">
						<span className="label">Name</span>
						<input
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							placeholder="Name"
						/>
					</label>

					<label className="form-row">
						<span className="label">Country</span>
						<select
							value={country}
							onChange={(e) => setCountry(e.target.value)}
							required
						>
							<option value="">Select country</option>
							{countries.map((c) => (
								<option
									key={c.id ?? c.code ?? c.name}
									value={c.name || c.country || c.code}
								>
									{c.name || c.country || c.code}
								</option>
							))}
						</select>
					</label>

					<div className="modal-actions">
						<button
							type="button"
							className="btn"
							onClick={onClose}
							disabled={saving}
						>
							Cancel
						</button>
						<button type="submit" className="btn btn-primary" disabled={saving}>
							{saving ? "Saving..." : "Save"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
