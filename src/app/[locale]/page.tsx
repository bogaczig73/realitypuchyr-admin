import { redirect } from "next/navigation";

// The dashboard that used to live here was template mock data end to end —
// counters, revenue chart, "recent transactions" and a world map with markers
// on Greenland and Palestine, all read from src/app/data/data. Radim asked for
// it hidden on 2026-09-21 rather than deleted, so the component tree is still
// in git history and components/ still holds the pieces it used.
//
// Redirect rather than delete the route: /{locale} is the URL the admin opens
// and the one the sidebar logo points at, so it has to keep resolving.
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/properties`);
}
