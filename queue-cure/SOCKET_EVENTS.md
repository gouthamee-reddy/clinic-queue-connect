# Socket Event Diagram

```mermaid
sequenceDiagram
    participant R as Receptionist Client
    participant S as Server (Express + Socket.io)
    participant D as Display Client

    Note over R,D: On connect, each client emits request_state
    R->>S: request_state
    S-->>R: queue_updated (full state)
    D->>S: request_state
    S-->>D: queue_updated (full state)

    R->>S: add_patient { name }
    S-->>R: queue_updated
    S-->>D: queue_updated

    R->>S: call_next
    S-->>R: queue_updated
    S-->>D: queue_updated

    R->>S: set_avg_time { minutes }
    S-->>R: queue_updated
    S-->>D: queue_updated
```

## Events
**Client → Server**
- `add_patient` `{ name }` — append a new waiting token
- `call_next` — finish current, promote next waiting to in-progress
- `set_avg_time` `{ minutes }` — update average consultation time
- `request_state` — request a fresh snapshot (used on connect/reconnect)

**Server → Client**
- `queue_updated` — full state object, broadcast after every change
