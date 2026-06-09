export default async function handler() {
  return new Response(JSON.stringify({ ok: true, node: process.version, cwd: process.cwd() }), {
    headers: { "Content-Type": "application/json" },
  });
}
