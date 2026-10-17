<?php
/**
 * Jediný zdroj údajů o firmě (telefon, e-mail, adresa, GPS, otevírací doba,
 * odkazy, fakturace).
 *
 * Odtud čte schema.org (inc/schema.php) i všechny PHP vzory, které se
 * vykreslují za běhu: hlavičky, patičky, mobilní lišty, stránka 404 a karta
 * pro recepce. Vzory, které si Jarda vloží do obsahu stránky nebo do
 * synchronizovaného vzoru (Kontaktní údaje, Otevírací doba, Výzva Zavolat),
 * si odtud vezmou výchozí text jen při vložení; potom už jde o kopii v databázi,
 * kterou je při změně údajů potřeba upravit v editoru (viz README).
 *
 * POZOR: otevírací doba není potvrzená majitelem (otevřená otázka č. 1
 * v docs/obsahova-mapa.md: Po–Čt 8–17, Pá 8–15 podle Googlu; starý web uvádí
 * Po–Pá 8–17 s pauzou 12–13, Firmy.cz 8–12 a 13–17). Po potvrzení upravit
 * tady a ve vložených kopiích vzorů Otevírací doba.
 *
 * @package AutoPraizler
 */

declare( strict_types=1 );

defined( 'ABSPATH' ) || exit;

/**
 * @return array<string, mixed>
 */
function ap_business_data(): array {
	static $data = null;
	if ( null !== $data ) {
		return $data;
	}

	$data = array(
		'name'            => 'AutoPraizler M.L.',
		'owner'           => 'Jaroslav Praizler',
		'ico'             => '87674343',
		'founding_date'   => '2011-03-09',

		'phone_e164'      => '+420728920290',
		'phone_display'   => '+420 728 920 290',
		'phone_short'     => '728 920 290',
		'phone_url'       => 'tel:+420728920290',
		'whatsapp_url'    => 'https://wa.me/420728920290',
		'email'           => 'servis@autopraizler.cz',

		'street'          => 'U Mlékárny 844/8a',
		'postal_code'     => '353 01',
		'city'            => 'Mariánské Lázně',
		'district'        => 'Úšovice',
		'country'         => array(
			'cs' => '',
			'de' => 'Tschechien',
			'en' => 'Czech Republic',
		),
		'lat'             => 49.9562,
		'lng'             => 12.69333,
		'gps_display'     => '49.95620 N, 12.69333 E',
		'directions_url'  => 'https://www.google.com/maps/dir/?api=1&destination=49.95620,12.69333',
		'mapy_url'        => 'https://mapy.com/?q=49.95620,12.69333',

		'facebook_url'    => 'https://www.facebook.com/people/AutoPraizler-ML/100064057664199/',
		'firmy_url'       => 'https://www.firmy.cz/detail/2642756-autopraizler-marianske-lazne-usovice.html',

		'billing_address' => 'U Hřiště 280, 353 01 Velká Hleďsebe',
		'data_box'        => 'k9k4nh8',

		// NEPOTVRZENO – otázka č. 1 pro Jardu (viz hlavička souboru).
		'opening_hours'   => array(
			array(
				'days'   => array( 'Monday', 'Tuesday', 'Wednesday', 'Thursday' ),
				'opens'  => '08:00',
				'closes' => '17:00',
				'label'  => array(
					'cs' => 'Pondělí až čtvrtek',
					'de' => 'Montag bis Donnerstag',
					'en' => 'Monday to Thursday',
				),
				'short'  => array(
					'cs' => 'Po–Čt',
					'de' => 'Mo–Do',
					'en' => 'Mon–Thu',
				),
			),
			array(
				'days'   => array( 'Friday' ),
				'opens'  => '08:00',
				'closes' => '15:00',
				'label'  => array(
					'cs' => 'Pátek',
					'de' => 'Freitag',
					'en' => 'Friday',
				),
				'short'  => array(
					'cs' => 'Pá',
					'de' => 'Fr',
					'en' => 'Fri',
				),
			),
		),
		'weekend'         => array(
			'label' => array(
				'cs' => 'Sobota a neděle',
				'de' => 'Samstag und Sonntag',
				'en' => 'Saturday and Sunday',
			),
			'text'  => array(
				'cs' => 'po telefonické domluvě',
				'de' => 'nach telefonischer Absprache',
				'en' => 'by phone arrangement',
			),
			'short' => array(
				'cs' => 'So–Ne po domluvě',
				'de' => 'Sa–So nach Absprache',
				'en' => 'Sat–Sun by arrangement',
			),
		),
	);

	return $data;
}

/**
 * Jedna hodnota z ap_business_data() (vnořené klíče oddělené tečkou,
 * např. "weekend.short.de"). Neexistující klíč vrací prázdný řetězec.
 */
function ap_business( string $key ): string {
	$value = ap_business_data();
	foreach ( explode( '.', $key ) as $part ) {
		if ( ! is_array( $value ) || ! array_key_exists( $part, $value ) ) {
			return '';
		}
		$value = $value[ $part ];
	}
	return is_scalar( $value ) ? (string) $value : '';
}

/**
 * Čas bez úvodní nuly: "08:00" → "8:00".
 */
function ap_hours_time( string $time ): string {
	return ltrim( $time, '0' );
}

/**
 * Řádky tabulky otevírací doby: [[popisek, čas], …, [víkend, text]].
 *
 * @return array<int, array{0: string, 1: string}>
 */
function ap_hours_rows( string $lang ): array {
	$data = ap_business_data();
	$rows = array();
	foreach ( $data['opening_hours'] as $item ) {
		$rows[] = array( $item['label'][ $lang ], ap_hours_time( $item['opens'] ) . ' – ' . ap_hours_time( $item['closes'] ) );
	}
	$rows[] = array( $data['weekend']['label'][ $lang ], $data['weekend']['text'][ $lang ] );
	return $rows;
}

/**
 * Krátký zápis do patičky: ["Po–Čt 8:00–17:00", "Pá 8:00–15:00", "So–Ne po domluvě"].
 *
 * @return string[]
 */
function ap_hours_short( string $lang ): array {
	$data  = ap_business_data();
	$lines = array();
	foreach ( $data['opening_hours'] as $item ) {
		$lines[] = $item['short'][ $lang ] . ' ' . ap_hours_time( $item['opens'] ) . '–' . ap_hours_time( $item['closes'] );
	}
	$lines[] = $data['weekend']['short'][ $lang ];
	return $lines;
}

/**
 * Nejkratší zápis pro tiskovou kartu: "Mo–Do 8–17, Fr 8–15".
 */
function ap_hours_compact( string $lang ): string {
	$parts = array();
	foreach ( ap_business_data()['opening_hours'] as $item ) {
		$parts[] = $item['short'][ $lang ] . ' ' . (int) $item['opens'] . '–' . (int) $item['closes'];
	}
	return implode( ', ', $parts );
}

/**
 * Adresa pro patičku: "U Mlékárny 844/8a<br>353 01 Mariánské Lázně[, Tschechien]".
 */
function ap_address_html( string $lang ): string {
	$data    = ap_business_data();
	$country = $data['country'][ $lang ] ?? '';
	return esc_html( $data['street'] ) . '<br>' . esc_html( $data['postal_code'] . ' ' . $data['city'] . ( '' !== $country ? ', ' . $country : '' ) );
}
