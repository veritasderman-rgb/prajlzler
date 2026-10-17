<?php
/**
 * Schema.org AutoRepair (JSON-LD) na české úvodní stránce.
 *
 * Jediný zdroj strukturovaných dat na webu. Modul schema v SEO pluginu
 * (Rank Math / Yoast) musí zůstat vypnutý, aby na stránce nebyly dva zdroje
 * s různými údaji (docs/navrh-sablony.md, část 4). Údaje bere z
 * ap_business_data() (inc/business.php), otevírací doba tam je označená
 * jako nepotvrzená (otázka č. 1).
 *
 * @package AutoPraizler
 */

declare( strict_types=1 );

defined( 'ABSPATH' ) || exit;

/**
 * @return array<string, mixed>
 */
function ap_schema_data(): array {
	$b    = ap_business_data();
	$logo = get_theme_file_uri( 'assets/img/autopraizler-logo.svg' );

	$hours = array();
	foreach ( $b['opening_hours'] as $item ) {
		$hours[] = array(
			'@type'     => 'OpeningHoursSpecification',
			'dayOfWeek' => count( $item['days'] ) === 1 ? $item['days'][0] : $item['days'],
			'opens'     => $item['opens'],
			'closes'    => $item['closes'],
		);
	}

	return array(
		'@context'                  => 'https://schema.org',
		'@type'                     => 'AutoRepair',
		'name'                      => $b['name'],
		// Fotka budovy až po potvrzení původu (otázka č. 10), zatím logo.
		'image'                     => $logo,
		'logo'                      => $logo,
		'url'                       => home_url( '/' ),
		'telephone'                 => $b['phone_e164'],
		'email'                     => $b['email'],
		'priceRange'                => '$$',
		'foundingDate'              => $b['founding_date'],
		'address'                   => array(
			'@type'           => 'PostalAddress',
			'streetAddress'   => $b['street'],
			'addressLocality' => $b['city'],
			'postalCode'      => $b['postal_code'],
			'addressCountry'  => 'CZ',
		),
		'geo'                       => array(
			'@type'     => 'GeoCoordinates',
			'latitude'  => $b['lat'],
			'longitude' => $b['lng'],
		),
		'openingHoursSpecification' => $hours,
		'sameAs'                    => array( $b['facebook_url'], $b['firmy_url'] ),
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
	// JSON_HEX_TAG a JSON_HEX_AMP: "<", ">" a "&" se zapíší jako < apod., obsah nemůže ukončit <script>.
	$json = wp_json_encode( ap_schema_data(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP );
	if ( ! is_string( $json ) ) {
		return;
	}
	echo '<script type="application/ld+json">' . $json . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- JSON bez < > & viz výše.
}
add_action( 'wp_head', 'ap_output_schema', 5 );
