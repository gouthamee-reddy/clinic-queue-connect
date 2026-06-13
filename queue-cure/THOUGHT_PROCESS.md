# Thought Process

## Data Model
A single object on the server is the authoritative state:
```js
{
  tokens: [{ number, name, status }],   // status: waiting | in-progress | done
  currentToken: number | null,          // token number currently being served
  avgConsultTime: number,               // minutes
  nextTokenNumber: number               // monotonically increasing counter
}
```
Why one flat object?
- **Simplicity:** the entire UI can be re-rendered from this snapshot.
- **Broadcasting full state** (rather than diffs) removes a huge class of bugs around dropped events and out-of-order delivery. With small clinic queues, payload size is negligible.
- `nextTokenNumber` is independent of `tokens.length`, so token numbers stay stable and unique even if we later add removal/cancel.

## Concurrency on `call_next`
Node.js is single-threaded, so two `call_next` events from the same socket can't literally execute in parallel — but they can be queued back-to-back on the event loop. A double click would advance the queue twice before any UI feedback arrived.

Guard: a module-level `callNextLock` boolean. The first `call_next` flips it true, performs the state transition, broadcasts, and releases the lock on a 50ms timeout. Any `call_next` arriving in that window is dropped. The client also disables the button optimistically and re-enables it from the next `queue_updated`. Combined, double-advances are prevented even across multiple receptionist tabs.

If the queue is empty, `call_next` is a safe no-op: there's no waiting token to promote, current stays `null`, and the broadcast just confirms current state to all clients.

## Reconnection Strategy
Socket.io reconnects automatically. To avoid stale UI:
- The server pushes `queue_updated` immediately on `connection`.
- The client also emits `request_state` on every `connect` (covers initial load and reconnects).
- All UI components render purely from the latest `queue_updated` payload, so refreshing a tab fully re-syncs without any local cache logic.

## Wait Time Computation
For a waiting token `T` on the Display page:
```
ahead = (# of waiting tokens with number < T) + (1 if someone is currently in-progress else 0)
wait  = ahead * avgConsultTime
```
This uses the live queue, not the token number, so cancellations or out-of-order additions still produce correct estimates. Because `avgConsultTime` is part of the broadcast state, changing it on the receptionist immediately re-renders wait estimates on every display client — no extra event needed.

Edge cases handled in the UI:
- Token never existed → "Token #X does not exist."
- Token already done → "Token #X has already been served."
- Token is currently in-progress → "It's your turn!"
- Empty queue / no current token → "No patient called yet."
