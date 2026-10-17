<?php
/**
 * Přepnutí locale podle jazyka stránky.
 *
 * Výchozí jazyk webu zůstává čeština (cs_CZ). Pro požadavky, jejichž cesta
 * začíná /de/ nebo /en/ (stránky pod rodiči "de" a "en"), se celý požadavek
 * přepne na de_DE resp. en_US, takže řetězce WordPressu a pluginů (formulář,
 * og:locale SEO pluginu), formáty datumů i atribut <html lang> odpovídají
 * jazyku stránky. Jazykové balíčky de_DE a en_US je potřeba doinstalovat
 * v Nastavení → Obecné (bez nich zůstanou řetězce jádra anglicky).
 *
 * Používá se switch_to_locale(), ne jen filtr "locale": výchozí textdomain
 * se načítá ještě před functions.php šablony a switch_to_locale() ho správně
 * znovu načte v novém jazyce.
 *
 * @package AutoPraizler
 */

declare( strict_types=1 );

defined( 'ABSPATH' ) || exit;

const AP_LOCALES = array(
	'cs' => 'cs_CZ',
	'de' => 'de_DE',
	'en' => 'en_US',
);

/**
 * Jazyk podle cesty požadavku: "de", "en" nebo null (čeština / nezjištěno).
 */
function ap_language_from_path(): ?string {
	$request = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
	$path    = (string) wp_parse_url( $request, PHP_URL_PATH );

	// Instalace v podsložce: odřízneme cestu domovské URL.
	$home_path = rtrim( (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH ), '/' );
	if ( '' !== $home_path && str_starts_with( $path, $home_path ) ) {
		$path = substr( $path, strlen( $home_path ) );
	}

	if ( preg_match( '#^/(de|en)(/|$)#', $path, $matches ) ) {
		return $matches[1];
	}
	return null;
}

/**
 * Bylo locale pro tento požadavek už přepnuto?
 */
function ap_locale_switched(): bool {
	return (bool) ( $GLOBALS['ap_locale_switched'] ?? false );
}

/**
 * Přepne locale, pokud jde o front end a jazyk není čeština.
 */
function ap_switch_locale( string $lang ): void {
	if ( ap_locale_switched() || ! isset( AP_LOCALES[ $lang ] ) || 'cs' === $lang ) {
		return;
	}
	if ( switch_to_locale( AP_LOCALES[ $lang ] ) ) {
		$GLOBALS['ap_locale_switched'] = true;
	}
}

/**
 * Brzké přepnutí podle cesty (/de/, /en/), ještě před výstupem čehokoli.
 */
function ap_switch_locale_for_request(): void {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || wp_is_json_request() ) {
		return;
	}
	$lang = ap_language_from_path();
	if ( null !== $lang ) {
		ap_switch_locale( $lang );
	}
}
add_action( 'after_setup_theme', 'ap_switch_locale_for_request', 0 );

/**
 * Záchrana pro adresy bez hezkých odkazů (?page_id=…): po zjištění dotazované
 * stránky se jazyk určí z jejích rodičů nebo šablony.
 */
function ap_switch_locale_for_page(): void {
	if ( is_admin() || ap_locale_switched() || ! is_page() ) {
		return;
	}
	ap_switch_locale( ap_page_language( get_queried_object_id() ) );
}
add_action( 'wp', 'ap_switch_locale_for_page' );

/**
 * <html lang="cs|de|en"> podle jazyka stránky (stejně jako statický návrh).
 */
function ap_language_attributes( string $output ): string {
	$lang = ap_current_language();
	if ( preg_match( '/\blang="[^"]*"/', $output ) ) {
		return (string) preg_replace( '/\blang="[^"]*"/', 'lang="' . esc_attr( $lang ) . '"', $output );
	}
	return trim( $output . ' lang="' . esc_attr( $lang ) . '"' );
}
add_filter( 'language_attributes', 'ap_language_attributes' );
