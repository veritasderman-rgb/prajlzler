<?php
/**
 * Výstup bloku autopraizler/language-switcher.
 *
 * @var array<string, mixed> $attributes Atributy bloku (žádné).
 * @var string               $content    Obsah (prázdný).
 * @var WP_Block             $block      Instance bloku.
 *
 * @package AutoPraizler
 */

declare( strict_types=1 );

$ap_current      = ap_current_language();
$ap_translations = array_fill_keys( AP_LANGUAGES, 0 );
if ( ! is_admin() && did_action( 'wp' ) && is_page() ) {
	$ap_translations = ap_get_translations( get_queried_object_id() );
}

$ap_labels = array(
	'cs' => 'CZ',
	'de' => 'DE',
	'en' => 'EN',
);
$ap_titles = array(
	'cs' => 'Česky',
	'de' => 'Deutsch',
	'en' => 'English',
);

$ap_wrapper = get_block_wrapper_attributes(
	array(
		'class'      => 'lang',
		'aria-label' => _x( 'Jazyk', 'popisek přepínače jazyků', 'autopraizler' ),
	)
);

echo '<nav ' . $ap_wrapper . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes escapuje.
foreach ( AP_LANGUAGES as $ap_lang ) {
	$ap_url = $ap_translations[ $ap_lang ] > 0
		? (string) get_permalink( $ap_translations[ $ap_lang ] )
		: ap_language_home_url( $ap_lang );

	printf(
		'<a href="%1$s" lang="%2$s" hreflang="%2$s" title="%3$s"%4$s>%5$s</a>',
		esc_url( $ap_url ),
		esc_attr( $ap_lang ),
		esc_attr( $ap_titles[ $ap_lang ] ),
		$ap_lang === $ap_current ? ' aria-current="page"' : '',
		esc_html( $ap_labels[ $ap_lang ] )
	);
}
echo '</nav>';
