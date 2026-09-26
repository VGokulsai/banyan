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
  meta: "17 · Pune",
  crafts: ["Video", "Design"],
  blurb: "Edits short documentaries about her city.",
  ships: [{ label: "reel", url: "https://…" }],
  reach: { label: "Instagram", url: "https://…" }   // optional
}
```

Adding a maker is adding one object. Their link and filter chip appear automatically. Craft filters only show crafts that actually have makers in them, so there are never empty shelves.

## What it is not

- **Not a job board or a placement service.** It shows the work; what happens after is between you and whoever reaches out.
- **Not a ranking.** No scores, no likes, no "top makers."
- **No accounts, no backend, no fee.** A page and a list.

## Run it

Open `index.html`. `index.html?check` runs six self-tests (card per maker, url-safe links, filter, escaping, submit link) and shows the result in the tab title.

---

Started 2026 by [Gokul Sai](https://github.com/VGokulsai), a 16-year-old maker in Hyderabad who was tired of building in the dark.
