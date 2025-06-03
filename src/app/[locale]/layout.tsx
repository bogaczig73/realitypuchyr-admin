import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { League_Spartan } from 'next/font/google';

const league_Spartan = League_Spartan({ 
  subsets: ['latin'],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-league_Spartan",
});

export function generateStaticParams() {
  return [{ locale: 'cs' }, { locale: 'de' }, { locale: 'en' }];
}

export const metadata: Metadata = {
  title: 'Reality Puchýř',
  description: 'Real Estate Management System',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    messages = (await import('@/messages/en.json')).default;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
} 