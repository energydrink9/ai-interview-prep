export async function enableMocking() {
    if (process.env.NODE_ENV !== 'development') {
        return
    }
    if (process.env.NEXT_RUNTIME === "nodejs") {
        return
    }

    const { worker } = await import('./browser')

    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.
    return worker.start()
}
