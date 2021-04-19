# Failure detectors 📡

Failure detectors are methods that detect errors when navigating and throws them.

Examples:

- Login errors
- Networking issues
- Anti-bot rate-limiting

By default, failure detectors should not timeout.
They also should never return. (To ensure that, use the `Promise<never>` return type.)

To use failure detectors:

```typescript
const browser = await newBrowser()
const page = browser.newPage()

// Making a Frankenstein promise that will throw if one of our detectors is angry
await Promise.race([
    bot.start(page),
    detectProxyDrop(page),
    detectDatadomeBlock(page),
    detectCloudfrontBlock(page)
])
```

## See also

- [p-event](https://yarnpkg.com/package/p-event): listen to events like they're promises.
