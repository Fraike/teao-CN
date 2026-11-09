import assert from "node:assert/strict";
import test from "node:test";
import nextConfig from "../../next.config";

test("legacy torque URLs 301 to /convert/", async () => {
  const redirects = await nextConfig.redirects!();
  const torque = redirects.filter(redirect => redirect.destination === "/convert/");
  assert.deepEqual(torque, [
    { source: "/torque-converter", destination: "/convert/", statusCode: 301 },
    { source: "/zh-hans/torque/:slug.html", destination: "/convert/", statusCode: 301 },
  ]);
});

test("no redirect destination is itself a redirect source", async () => {
  const redirects = await nextConfig.redirects!();
  for (const redirect of redirects) {
    assert.ok(
      !redirects.some(candidate => candidate.source === redirect.destination),
      `redirect loop: ${redirect.source} -> ${redirect.destination}`,
    );
  }
});
