// Simple integration test script for backend endpoints
// Run with: bun run test-server.ts (ensure server is already running on 3001)

async function hit(path: string) {
	const res = await fetch(`http://localhost:3001${path}`);
	const text = await res.text();
	let json: any;
	try { json = JSON.parse(text); } catch { json = text; }
	return { status: res.status, json };
}

async function main() {
	const tests: { name: string; path: string }[] = [
		{ name: 'Inventory Count (no filters)', path: '/api/inventory/count' },
		{ name: 'Inventory Page 1', path: '/api/inventory?page=1&pageSize=5' },
		{ name: 'Inventory Filter category=Accessories', path: '/api/inventory?category=Accessories' },
		{ name: 'Inventory Filter search=flower', path: '/api/inventory?search=flower' },
		{ name: 'Inventory Filter category=Cannabis&subcategory=Edibles', path: '/api/inventory?category=Cannabis&subcategory=Edibles' },
	];

	for (const t of tests) {
		try {
			const result = await hit(t.path);
			console.log(`\n[Test] ${t.name}`);
			console.log(JSON.stringify(result, null, 2));
		} catch (e) {
			console.error(`Error during test ${t.name}:`, e);
		}
	}
}

main();
