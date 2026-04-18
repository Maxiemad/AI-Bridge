# Use Case Diagram

Shows how users interact with the AI Bridge system and what the system handles internally.

```mermaid
flowchart LR
    subgraph User Actions
        A[Register / Login]
        B[Create Profile]
        C[View Opportunities]
        D[Apply to Opportunity]
        E[Track Application Status]
    end

    subgraph AI Bridge System
        F[Fetch Opportunities]
        G[Rank Opportunities]
        H[Generate Application]
        I[Send Notifications]
    end

    A --> B
    B --> C
    F --> G
    G --> C
    C --> D
    D --> H
    H --> E
    I --> E
```

## Actor Descriptions

**User** — registers an account, fills out a profile with skills and interests, browses ranked opportunities, applies to selected ones, and monitors the status of submitted applications.

**AI Bridge System** — runs background fetching of opportunities from various sources, ranks them using the AI engine based on the user's profile, generates personalized application content when requested, and sends deadline reminders and status updates through the notification service.
