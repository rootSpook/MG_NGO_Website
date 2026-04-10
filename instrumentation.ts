/**
 * Next.js instrumentation hook — runs once when the server starts.
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * The nodejs guard ensures this only runs in the Node.js runtime (not Edge).
 * autoSeed.server.ts uses the Firebase Admin SDK which requires Node.js.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { runAutoSeed } = await import("./lib/firebase/autoSeed.server");
    await runAutoSeed();
  }
}
