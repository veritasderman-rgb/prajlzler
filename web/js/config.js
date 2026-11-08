/* AutoPraizler M.L. – konfigurace měření konverzí.
 * Všechny hodnoty jsou ve výchozím stavu prázdné => js/mereni.js nic nenačítá, nezobrazuje lištu cookies
 * a neukládá žádné údaje. Jak hodnoty vyplnit, popisuje README.md (sekce „Měření konverzí“).
 * Soubor neobsahuje žádná tajemství – ID konverzí jsou veřejná, ale do repozitáře je doplňte až po založení účtů. */
window.AP_CONFIG = {
  googleAdsId: '',          // např. 'AW-123456789'
  googleAdsFormLabel: '',   // štítek konverze „odeslaný formulář“, např. 'AbCdEfGhIjKlMnOp'
  googleAdsCallLabel: '',   // štítek konverze „kliknutí na telefon“
  ga4Id: '',                // např. 'G-XXXXXXXXXX' (Google Analytics 4), nepovinné
  sklikConversionId: '',    // číselné ID konverze Sklik, např. '100012345'
  sklikConversionValue: 0   // hodnota konverze Sklik v Kč (0 = bez hodnoty)
};
