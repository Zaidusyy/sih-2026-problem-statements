# SIH 2026 Problem Statements — with daily submission history

All **233** Smart India Hackathon 2026 problem statements as JSON and CSV, plus
the thing no other copy has: **a daily record of how many ideas each statement
has attracted.**

Maintained by [Zaid Sayyed](https://zaidsayyed.in), National Winner of Smart
India Hackathon 2025.

```
233 statements   176 software   57 hardware   17 themes   33 organisations
```

## Why the history matters

The official portal shows a live `n / 500` idea count against each statement and
overwrites it. Yesterday's number is not stored anywhere, by anyone.

So the questions every team actually has — *is this one filling up? has anybody
picked it? did it just spike?* — cannot be answered from the portal, or from any
other mirror of it, or retroactively by anyone starting today.

This repo has been writing the counts down since **28 August 2026**, when every
statement was still on zero.

```
2026-08-28    229 statements      0 ideas submitted
2026-09-06    233 statements    178 ideas submitted, across 96 statements
```

137 statements still have nobody on them. Four statements (SIH26230 to
SIH26233) were added after the original list went out, so any team that
shortlisted in the first week has never seen them.

## Files

| File | What it is |
|---|---|
| `data/problem-statements.json` | All 233, with the full brief text |
| `data/problem-statements.csv` | Same, minus the brief, so it opens in a spreadsheet |
| `data/submission-history.json` | Dated snapshots, `{date, total, counts}` |
| `data/submission-history.csv` | The same history flattened to `date,psNumber,submitted` |
| `data/summary.json` | Current totals, for anyone who just wants the headline |

### Statement schema

```jsonc
{
  "psNumber": "SIH26001",
  "title": "AI-Based early warning and landslide Risk Monitoring System in NER",
  "organisation": "Ministry of Development of North Eastern Region (MDoNER)",
  "department": "Ministry of Development of North Eastern Region (MDoNER)",
  "category": "Software",          // or "Hardware"
  "theme": "Disaster Management",
  "submitted": 7,                  // ideas submitted at last sync
  "cap": 500,                      // per-statement submission limit
  "deadline": "30 September 2026",
  "description": "Background:\n\n…", // the full official brief
  "youtube": "",                    // official explainer, where one exists
  "dataset": ""                     // official dataset link, where one exists
}
```

### History schema

`counts` holds only the statements with a non-zero count. Most sit at zero for
weeks and writing all of them every run would bloat the file for no information.

```jsonc
{
  "firstSeen": { "SIH26230": "2026-09-06" },   // when each statement appeared
  "snapshots": [
    { "date": "2026-08-28", "statements": 229, "total": 0,   "counts": {} },
    { "date": "2026-09-06", "statements": 233, "total": 178, "counts": { "SIH26001": 7 } }
  ]
}
```

## Updates

Twice a day, 08:00 and 20:00 IST.

Collection runs from a residential connection, not CI — `sih.gov.in` returns
`403` to GitHub Actions and to cloud providers, so a scheduled workflow cannot
do this. If a run is blocked the previous snapshot is left untouched rather than
overwritten with a partial parse.

## Use it

```bash
curl -O https://raw.githubusercontent.com/Zaidusyy/sih-2026-problem-statements/main/data/problem-statements.json
```

```python
import pandas as pd

ps = pd.read_json("data/problem-statements.json")
hist = pd.read_csv("data/submission-history.csv")

# Which statements are gaining fastest
pivot = hist.pivot(index="psNumber", columns="date", values="submitted").fillna(0)
(pivot.iloc[:, -1] - pivot.iloc[:, 0]).sort_values(ascending=False).head(10)
```

## Honest caveats

- **Unofficial.** The authoritative source is [sih.gov.in](https://sih.gov.in).
  Verify anything you are going to act on.
- The counts are a snapshot at sync time, not a continuous feed. A statement can
  move between two runs and the jump appears at the later one.
- `submitted: 0` during the early weeks means the field has not arrived, not
  that a statement is bad.
- The 28 August snapshot recorded the deadline as 20 September and the current
  one reads 30 September. I have not established whether the portal changed or
  the earlier parse read the wrong column, so treat the earlier deadline value
  as unverified. Every other field in that snapshot matches.

## Browsing it instead

If you would rather not work with the raw files:

- [Every statement, searchable and filterable](https://zaidsayyed.in/tools/sih-problem-statements),
  with a tool that scores all 233 against your team's actual skills
- [Which statements teams are actually picking](https://zaidsayyed.in/tools/sih-problem-statements/trends),
  the history above, rendered
- [SIH 2026 playbook](https://zaidsayyed.in/blog/sih-2026) and the
  [college internal round guide](https://zaidsayyed.in/blog/sih-2026-internal-hackathon-guide),
  written from having won it

## Licence

Problem statement text is published by the Government of India on sih.gov.in and
belongs to them. The collection, the submission history and the scripts are
released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — use
them freely, including commercially, with attribution to
[zaidsayyed.in](https://zaidsayyed.in).
