# AgroVibes Database

Data for the farming app is stored in **`data.json`** (created by the backend on first run). No separate setup needed.

## Optional: SQLite

For a production setup you can use SQLite instead:

1. From this folder:
```bash
sqlite3 agro.db < schema.sql
sqlite3 agro.db < seed.sql
```
2. Point the backend at the SQLite file (requires switching backend to use `better-sqlite3` and build tools).

## Schema overview

| Table        | Description                     |
|-------------|---------------------------------|
| posts       | Media feed (farmer stories)     |
| guides      | Knowledge base articles         |
| equipment   | Rent/sell equipment listings    |
| workers     | Labor profiles                  |
| jobs        | Job listings                    |
| products    | Fertilizers & seeds catalog     |
| sales_items | Direct farm sales marketplace   |
| courses     | Learning hub courses            |

## Location

The backend reads/writes `database/data.json`. Set `DB_PATH` to a folder path to use a different directory.
