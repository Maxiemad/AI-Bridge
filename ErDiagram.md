# Entity Relationship Diagram

Database schema showing how the three core entities relate to each other.

```mermaid
erDiagram

    USER ||--o{ APPLICATION : "submits"
    OPPORTUNITY ||--o{ APPLICATION : "receives"

    USER {
        ObjectId _id
        string name
        string email
        string password
        array skills
        array interests
        date createdAt
    }

    OPPORTUNITY {
        ObjectId _id
        string title
        string description
        string source
        string type
        string url
        array tags
        date deadline
        date createdAt
    }

    APPLICATION {
        ObjectId _id
        ObjectId userId FK
        ObjectId opportunityId FK
        string status
        string coverLetter
        string emailDraft
        string notes
        date appliedAt
        date updatedAt
    }
```

## Relationships

- A **User** can submit many **Applications** (one-to-many)
- An **Opportunity** can receive many **Applications** (one-to-many)
- Each **Application** links exactly one User to one Opportunity

## Status Values

Applications move through these states: `pending` → `submitted` → `accepted` or `rejected`
