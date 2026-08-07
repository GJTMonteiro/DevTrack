const countries: Record<string, string> = {
  portugal: 'PT',
  spain: 'ES',
  france: 'FR',
  germany: 'DE',
  italy: 'IT',
  belgium: 'BE',
  netherlands: 'NL',
  luxembourg: 'LU',
  switzerland: 'CH',
  austria: 'AT',
  ireland: 'IE',
  'united kingdom': 'GB',
  england: 'GB',
  scotland: 'GB',
  wales: 'GB',

  'united states': 'US',
  usa: 'US',
  canada: 'CA',
  mexico: 'MX',
  brazil: 'BR',
  argentina: 'AR',
  chile: 'CL',
  colombia: 'CO',
  peru: 'PE',

  japan: 'JP',
  china: 'CN',
  'south korea': 'KR',
  'north korea': 'KP',
  india: 'IN',
  pakistan: 'PK',
  thailand: 'TH',
  vietnam: 'VN',
  singapore: 'SG',
  malaysia: 'MY',
  indonesia: 'ID',
  philippines: 'PH',

  australia: 'AU',
  'new zealand': 'NZ',

  russia: 'RU',
  ukraine: 'UA',
  poland: 'PL',
  'czech republic': 'CZ',
  czechia: 'CZ',
  slovakia: 'SK',
  hungary: 'HU',
  romania: 'RO',
  bulgaria: 'BG',
  croatia: 'HR',
  serbia: 'RS',
  slovenia: 'SI',

  finland: 'FI',
  greece: 'GR',
  sweden: 'SE',
  norway: 'NO',
  denmark: 'DK',
  iceland: 'IS',
  estonia: 'EE',
  latvia: 'LV',
  lithuania: 'LT',

  turkey: 'TR',

  morocco: 'MA',
  algeria: 'DZ',
  tunisia: 'TN',
  egypt: 'EG',
  'south africa': 'ZA',
  nigeria: 'NG',
};


export function getCountryCode(country: string): string {
  if (!country) return '';

  const normalized = country.trim().toLowerCase();

  return countries[normalized] ?? '';
}