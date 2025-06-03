import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  if (!locale) {
    return {
      messages: {},
      locale: 'cs',
      timeZone: 'Europe/Prague',
      now: new Date()
    };
  }
  const messages = (await import(`../messages/${locale}.json`)).default;
  return {
    messages,
    locale,
    timeZone: 'Europe/Prague',
    now: new Date()
  };
}); 