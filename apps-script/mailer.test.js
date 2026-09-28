// node apps-script/mailer.test.js : runs mailer.gs against a fake sheet, no real email
const fs = require("fs"), vm = require("vm"), assert = require("assert");
const sent = [];
function fakeSheet(rows){
  return {
    rows, getName: () => "Form Responses 1",
    getRange(r, c, nr = 1, nc = 1){
      return {
        getValues: () => rows.slice(r - 1, r - 1 + nr).map(row => { const out = []; for (let i = 0; i < nc; i++) out.push(row[c - 1 + i] ?? ""); return out; }),
        setValue: v => { rows[r - 1][c - 1] = v; }
      };
    }
  };
}
const ctx = { MailApp: { sendEmail: m => sent.push(m) }, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + "/mailer.gs", "utf8") + ";this.sendFor = sendFor; this.slug = slug;", ctx);

//            A    B              C  D  E  F  G  H  I                 J      K  L      M
const hdr = ["t", "name", "", "", "", "", "", "", "email", "consent", "", "Approved", "Link sent"];
const row = (name, email, approved, consent = "Yes") => ["t", name, "", "", "", "", "", "", email, consent, "", approved, ""];
const sh = fakeSheet([hdr,
  row("Ram Chetan", "ram@x.com", "yes"),          // 2: new maker
  row("Priya", "p@x.com", ""),                    // 3: not approved
  row(" ram  chetan ", "ram@x.com", " Yes "),     // 4: same person, new project
  row("Kid", "k@x.com", "yes", ""),               // 5: no public consent
]);

assert.strictEqual(ctx.slug("Priya Rao-Sharma!"), "priya-rao-sharma", "slug must match index.html");
assert.match(ctx.sendFor(sh, 2, false), /^sent/);
assert.strictEqual(sent[0].subject, "You're on Banyan");
assert.ok(sent[0].body.includes("https://vgokulsai.github.io/banyan/#ram-chetan"));
assert.ok(sent[0].body.includes("https://vgokulsai.github.io/banyan/?edit#ram-chetan"));
assert.match(ctx.sendFor(sh, 2, false), /already sent/, "never emails the same row twice");
assert.match(ctx.sendFor(sh, 3, false), /not approved/);
assert.match(ctx.sendFor(sh, 4, false), /^sent/);
assert.strictEqual(sent[1].subject, "Your new project is on Banyan", "second approval of a name is an update");
assert.ok(!sent[1].body.includes("?edit"), "update email doesn't resend the private link");
assert.match(ctx.sendFor(sh, 5, false), /no public consent/);
assert.strictEqual(sent.length, 2);
console.log("mailer: all checks pass");
