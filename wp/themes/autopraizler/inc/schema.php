<?php
/**
 * Schema.org AutoRepair (JSON-LD) na české úvodní stránce.
 *
 * Jediný zdroj strukturovaných dat na webu. Modul schema v SEO pluginu
 * (Rank Math / Yoast) musí zůstat vypnutý, aby na stránce nebyly dva zdroje
 * s různými údaji (docs/navrh-sablony.md, část 4).
 *
 * @package AutoPraizler
 */

declare( strict_types=1 );

defined( 'ABSPATH' ) || exit;

/**
 * Data pro JSON-LD. Přeneseno z <script type="application/ld+json"> ve
 * statickém návrhu (index.html).
 *
 * POZOR: otevírací doba není potvrzená majitelem (otevřená otázka č. 1
 * v docs/obsahova-mapa.md: Po–Čt 8–17, Pá 8–15 podle Googlu; starý web uvádí
 * Po–Pá 8–17 s pauzou 12–13). Po potvrzení upravit tady i ve vzorech
 * "Otevírací doba" a v patičkách.
 *
 * @return array<string, mixed>
 */
function ap_schema_data(): array {
	$logo = get_theme_file_uri( 'assets/img/autopraizler-logo.svg' );

	return array(
		'@context'                  => 'https://schema.org',
		'@type'                     => 'AutoRepair',
		'name'                      => 'AutoPraizler M.L.',
		// Fotka budovy až po potvrzení původu (otázka č. 10), zatím logo.
		'image'                     => $logo,
		'logo'                      => $logo,
		'url'                       => home_url( '/' ),
		'telephone'                 => '+420728920290',
		'email'                     => 'servis@autopraizler.cz',
		'priceRange'                => '$$',
		'foundingDate'              => '2011-03-09',
		'address'                   => array(
			'@type'           => 'PostalAddress',
			'streetAddress'   => 'U Mlékárny 844/8a',
			'addressLocality' => 'Mariánské Lázně',
			'postalCode'      => '353 01',
			'addressCountry'  => 'CZ',
		),
		'geo'                       => array(
			'@type'     => 'GeoCoordinates',
			'latitude'  => 49.9562,
			'longitude' => 12.69333,
		),
		// Neověřeno, viz komentář výše.
		'openingHoursSpecification' => array(
			array(
				'@type'     => 'OpeningHoursSpecification',
				'dayOfWeek' => array( 'Monday', 'Tuesday', 'Wednesday', 'Thursday' ),
				'opens'     => '08:00',
				'closes'    => '17:00',
			),
			array(
				'@type'     => 'OpeningHoursSpecification',
				'dayOfWeek' => 'Friday',
				'opens'     => '08:00',
				'closes'    => '15:00',
			),
		),
		'sameAs'                    => array(
			'https://www.facebook.com/people/AutoPraizler-ML/100064057664199/',
			'https://www.firmy.cz/detail/2642756-autopraizler-marianske-lazne-usovice.html',
		),
		'areaServed'                => array( 'Mariánské Lázně', 'Cheb', 'Karlovarský kraj' ),
		'knowsLanguage'             => array( 'cs', 'de', 'en' ),
	);
}

/**
 * Výstup do <head> jen na české úvodní stránce.
 */
function ap_output_schema(): void {
	if ( ! is_front_page() || is_paged() || 'cs' !== ap_current_language() ) {
		return;
	}
	$json = wp_json_encode( ap_schema_data(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
	if ( ! is_string( $json ) ) {
		return;
	}
	// JSON neobsahuje uživatelský vstup; "<" se escapuje kvůli ukončení <script>.
	echo '<script type="application/ld+json">' . str_replace( '<', '<', $json ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'ap_output_schema', 5 );
