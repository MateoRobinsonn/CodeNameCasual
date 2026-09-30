// One-time setup: creates the single storefront admin in Supabase Auth and
// tags them with app_metadata.role = "admin", which is what the RLS
// policies in supabase/migrations/0001_init.sql check. There is no public
// admin registration route by design — this script is the only way in.
//
// Usage:
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' \
//     node --env-file=.env.local scripts/bootstrap-admin.ts

import { createAdminClient } from "../lib/supabase/admin.ts";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD before running this script.");
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("ADMIN_PASSWORD should be at least 12 characters.");
    process.exit(1);
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase.auth.admin.listUsers();
  const alreadyExists = existing?.users.some((u) => u.email === email);
  if (alreadyExists) {
    console.error(`A user with email ${email} already exists. Refusing to create a second admin.`);
    process.exit(1);
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: "admin" },
  });

  if (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }

  console.log(`Admin created: ${data.user.id} <${data.user.email}>`);
  console.log("Sign in at /admin/login. Enable MFA for this account in the Supabase dashboard.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
