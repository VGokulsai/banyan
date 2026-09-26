# Banyan 🌳

Young makers in India, seen. **Proof, not pedigree.**

Most of the events, funding and exposure for young makers live in the US. If you're a teenager in India making real things, you can be genuinely good and still invisible. Banyan is a small fix: one page that shows young makers in India and the work they've shipped, so the next kid doesn't build alone.

Not just code. Design, video editing, writing, music — if you made it and it's out in the world, it counts.

## Getting on Banyan

1. **Send your work** through the form on the page: who you are, your craft, links to what you've shipped.
2. **A real person reads it.** Every submission is checked by hand. The only bar is that it's real and it's yours.
3. **You go live with your own link** — `…/banyan/#your-name` — which opens the page scrolled to your card. Put it in your bio, your applications, your DMs.

Nobody goes on the page without saying yes first.

## Looking for talent?

Filter by craft, open their work, and reach out through the contact link each maker chose to share. No résumés, no marks — just the work.

## How it works

One file. Every maker is one object in the `MAKERS` array in `index.html`:

```js
{
  name: "Priya Rao",
  city: "Pune",
  age: 17,                      // optional — shown as "age 17" next to the join date, so it never goes stale
  added: "2026-10",             // the month they joined; numbering and "updated" come from this
  crafts: ["Video", "Design"],
  blurb: "Edits short documentaries about her city.",
  ships: [{ label: "old-city", what: "A 6-minute film about the last hand-press printers in Pune.", url: "https://…" }],
  open: ["freelance", "collabs"],                     // optional — only what they said
  reach: { label: "Instagram", url: "https://…" }   // optional — only a contact they chose to share
}
```

Adding a maker is adding one object. Everything else follows from it: their number (No. 001 is the first to join), their own link, the "updated" date, the craft filter (it only appears once there are two or more crafts), and their **Get your card** image — a 1080×1350 story card drawn in the browser that they can post.

## What it is not

- **Not a job board or a placement service.** It shows the work; what happens after is between you and whoever reaches out.
- **Not a ranking.** No scores, no likes, no "top makers."
- **No accounts, no backend, no fee.** A page and a list.

## Run it

Open `index.html`. `index.html?check` runs twelve self-tests — a card per maker, url-safe links, the filter staying hidden until there are two crafts, escaping, the form link, numbering, and the story card (right size, and never overlapping its footer even for a very long name) — and shows the result in the tab title.

---

Started 2026 by [Gokul Sai](https://github.com/VGokulsai), a 16-year-old maker in Hyderabad who was tired of building in the dark.
