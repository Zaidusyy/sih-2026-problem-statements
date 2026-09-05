// Rebuilds every published file from the current snapshot.
//
// Run by the same scheduled task that syncs the site, so the repo and the site
// can never disagree about what the board looked like on a given day.

import fs from "node:fs";
import path from "node:path";

const SRC = process.env.SIH_SRC ?? "E:/Portfolio/src/data";
const OUT = path.dirname(new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

const statements = JSON.parse(
    fs.readFileSync(path.join(SRC, "sih-problem-statements.json"), "utf8")
);
const history = JSON.parse(fs.readFileSync(path.join(SRC, "sih-ps-history.json"), "utf8"));

const dataDir = path.join(OUT, "data");
fs.mkdirSync(dataDir, { recursive: true });

fs.writeFileSync(
    path.join(dataDir, "problem-statements.json"),
    JSON.stringify(statements, null, 1) + "\n"
);
fs.writeFileSync(
    path.join(dataDir, "submission-history.json"),
    JSON.stringify(history, null, 1) + "\n"
);

// CSV without the description, because a 3 KB brief with newlines in it makes
// the file unopenable in a spreadsheet, which is the only reason to want CSV.
const cell = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const columns = [
    "psNumber",
    "title",
    "organisation",
    "department",
    "category",
    "theme",
    "submitted",
    "cap",
    "deadline",
    "youtube",
    "dataset",
];

const csv = [
    columns.join(","),
    ...statements.map((s) => columns.map((c) => cell(s[c])).join(",")),
].join("\n");

fs.writeFileSync(path.join(dataDir, "problem-statements.csv"), csv + "\n");

// A flat table of the counts over time, which is the shape anyone plotting it
// actually wants. The nested JSON is better for lookups, worse for pandas.
const rows = ["date,psNumber,submitted"];
for (const snap of history.snapshots) {
    for (const [ps, n] of Object.entries(snap.counts)) {
        rows.push(`${snap.date},${ps},${n}`);
    }
}
fs.writeFileSync(path.join(dataDir, "submission-history.csv"), rows.join("\n") + "\n");

const latest = history.snapshots[history.snapshots.length - 1];
const software = statements.filter((s) => s.category === "Software").length;

// Numbers the README quotes, written where they cannot drift out of date.
fs.writeFileSync(
    path.join(dataDir, "summary.json"),
    JSON.stringify(
        {
            updated: latest.date,
            statements: statements.length,
            software,
            hardware: statements.length - software,
            themes: [...new Set(statements.map((s) => s.theme))].length,
            organisations: [...new Set(statements.map((s) => s.organisation))].length,
            ideasSubmitted: latest.total,
            statementsWithIdeas: Object.keys(latest.counts).length,
            statementsWithNone: statements.length - Object.keys(latest.counts).length,
            snapshots: history.snapshots.length,
            firstSnapshot: history.snapshots[0].date,
        },
        null,
        2
    ) + "\n"
);

console.log(
    `${statements.length} statements, ${history.snapshots.length} snapshots, ${latest.total} ideas as of ${latest.date}`
);
