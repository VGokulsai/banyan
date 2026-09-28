// Banyan mailer: lives inside the "Get on Banyan (Responses)" sheet (Extensions → Apps Script).
// When Gokul types "yes" in the Approved column, the maker gets an email with their links. Once per row:
// the send time goes in the "Link sent" column, and a row with anything in it is never emailed again.
// Setup: paste this in, run setup() once, and allow the permissions it asks for (send email as you, edit this sheet).

const SITE = "https://banyanmakers.pages.dev/";
const SHEET = "Form Responses 1";
const COL = { name: 2, email: 9, consent: 10, approved: 12, sent: 13 };   // B, I, J, L, M

// must match slug() in index.html, or the links point at the wrong card
function slug(n){ return String(n).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
const tidy = s => String(s || "").trim().replace(/\s+/g, " ");
const isYes = s => tidy(s).toLowerCase() === "yes";

function onApprove(e){
  const sh = e.range.getSheet();
  if (sh.getName() !== SHEET) return;
  if (COL.approved < e.range.getColumn() || COL.approved > e.range.getLastColumn()) return;
  for (let r = Math.max(2, e.range.getRow()); r <= e.range.getLastRow(); r++) sendFor(sh, r, false);
}

// returns what it did, so preview() can show the email without sending it
function sendFor(sh, r, dryRun){
  const row = sh.getRange(r, 1, 1, COL.sent).getValues()[0], v = c => tidy(row[c - 1]);
  if (!isYes(v(COL.approved))) return "skip: not approved";
  if (!v(COL.consent)) return "skip: no public consent, so no card";
  if (v(COL.sent)) return "skip: already sent " + v(COL.sent);
  const name = v(COL.name), s = slug(name), email = v(COL.email);
  if (!s || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "skip: name or email unusable";

  // an earlier approved row with the same name means this is a new project, not a new maker
  const prev = r > 2 ? sh.getRange(2, 1, r - 2, COL.approved).getValues() : [];
  const isUpdate = prev.some(p => slug(tidy(p[COL.name - 1])) === s && isYes(p[COL.approved - 1]));

  const first = name.split(" ")[0], pub = SITE + "#" + s, priv = SITE + "?edit#" + s;
  const mail = isUpdate ? {
    to: email, name: "Gokul from Banyan",
    subject: "Your new project is on Banyan",
    body: `Hey ${first},\n\nYour new project is on your card now (give it a few minutes to show):\n${pub}\n\nGokul`
  } : {
    to: email, name: "Gokul from Banyan",
    subject: "You're on Banyan",
    body: `Hey ${first},\n\nYou're on Banyan! Your card goes live within a few minutes.\n\n` +
      `Your link, share it anywhere (bio, applications, DMs):\n${pub}\n\n` +
      `Your private link, just for you. Open it to add new projects to your card later. Please don't share this one:\n${priv}\n\n` +
      `Your card also has a "Get your card" button that makes an image for your story.\n\nGokul`
  };
  if (dryRun) return JSON.stringify(mail, null, 2);
  MailApp.sendEmail(mail);
  sh.getRange(r, COL.sent).setValue(new Date());
  return "sent to " + email;
}

// run once: installs the trigger (a plain onEdit can't send email) and labels the column
function setup(){
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("onApprove").forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create();
  SpreadsheetApp.getActive().getSheetByName(SHEET).getRange(1, COL.sent).setValue("Link sent");
}

// shows the email row 2 would get, without sending anything
function preview(){ Logger.log(sendFor(SpreadsheetApp.getActive().getSheetByName(SHEET), 2, true)); }
