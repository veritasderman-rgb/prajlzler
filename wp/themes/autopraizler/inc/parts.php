<?php
/**
 * Generátory blokového markupu pro části šablony (hlavička, patička, mobilní
 * lišta) a stránku 404 v CZ / DE / EN. Volají je skryté vzory v patterns/
 * (hlavicka*, paticka*, lista*, chyba-404), které vkládají části šablony
 * parts/*.html. Údaje o firmě bere z ap_business_data().
 *
 * @package AutoPraizler
 */

declare( strict_types=1 );

defined( 'ABSPATH' ) || exit;

/**
 * Texty hlavičky, patičky, lišty a 404 podle jazyka.
 *
 * @return array<string, mixed>
 */
function ap_part_strings( string $lang ): array {
	$b = ap_business_data();

	$strings = array(
		'cs' => array(
			'home'           => '/',
			'nav'            => array(
				array( 'Pomoc v nouzi', '/pomoc-v-nouzi/', 'nav-sos' ),
				array( 'Služby', '/sluzby/' ),
				array( 'Ceník', '/cenik/' ),
				array( 'O nás', '/o-nas/' ),
				array( 'Recenze', '/recenze/' ),
				array( 'Kontakt', '/kontakt/' ),
			),
			'phone_label'    => $b['phone_short'],
			'bar_label'      => 'Zavolat ' . $b['phone_short'],
			'tagline'        => 'Autoservis a pneuservis v Mariánských Lázních od roku 2011. ' . $b['owner'] . ', IČO ' . $b['ico'] . '.',
			'h_contact'      => 'Kontakt',
			'h_open'         => 'Otevřeno',
			'h_pages'        => 'Web',
			'footer_links'   => array(
				array( 'Pomoc v nouzi', '/pomoc-v-nouzi/' ),
				array( 'Služby', '/sluzby/' ),
				array( 'Ceník', '/cenik/' ),
				array( 'O nás', '/o-nas/' ),
				array( 'Recenze', '/recenze/' ),
				array( 'Kontakt', '/kontakt/' ),
			),
			'other_langs'    => array(
				array( 'Deutsch', '/de/', 'de' ),
				array( 'English', '/en/', 'en' ),
			),
			'legal_extra'    => true,
			'404_eyebrow'    => 'Chyba 404',
			'404_title'      => 'Tuhle stránku jsme nenašli',
			'404_lead'       => 'Stránka neexistuje nebo byla přesunuta. Zkuste úvodní stránku, nebo nám rovnou zavolejte, s autem poradíme i po telefonu.',
			'404_home'       => 'Na úvodní stránku',
			'404_contact'    => array( 'Kontakt', '/kontakt/' ),
		),
		'de' => array(
			'home'           => '/de/',
			'nav'            => array(
				array( 'Pannenhilfe', '/de/hilfe/', 'nav-sos' ),
				array( 'Leistungen', '/de/#leistungen' ),
				array( 'Kontakt', '/de/kontakt/' ),
			),
			'phone_label'    => $b['phone_display'],
			'bar_label'      => 'Anrufen ' . $b['phone_display'],
			'tagline'        => 'Autowerkstatt und Reifenservice in Marienbad seit 2011. ' . $b['owner'] . ', ID-Nr. ' . $b['ico'] . '.',
			'h_contact'      => 'Kontakt',
			'h_open'         => 'Geöffnet',
			'h_pages'        => 'Seiten',
			'footer_links'   => array(
				array( 'Pannenhilfe', '/de/hilfe/' ),
				array( 'Leistungen', '/de/#leistungen' ),
				array( 'Kontakt', '/de/kontakt/' ),
			),
			'other_langs'    => array(
				array( 'Česky', '/', 'cs' ),
				array( 'English', '/en/', 'en' ),
			),
			'legal_extra'    => false,
			'404_eyebrow'    => 'Fehler 404',
			'404_title'      => 'Diese Seite gibt es nicht',
			'404_lead'       => 'Die Seite existiert nicht oder wurde verschoben. Gehen Sie zur Startseite, oder rufen Sie uns einfach an.',
			'404_home'       => 'Zur Startseite',
			'404_contact'    => array( 'Kontakt', '/de/kontakt/' ),
		),
		'en' => array(
			'home'           => '/en/',
			'nav'            => array(
				array( 'Breakdown help', '/en/help/', 'nav-sos' ),
				array( 'Services', '/en/#services' ),
				array( 'Contact', '/en/contact/' ),
			),
			'phone_label'    => $b['phone_display'],
			'bar_label'      => 'Call ' . $b['phone_display'],
			'tagline'        => 'Car repair and tyre service in Mariánské Lázně since 2011. ' . $b['owner'] . ', company ID ' . $b['ico'] . '.',
			'h_contact'      => 'Contact',
			'h_open'         => 'Open',
			'h_pages'        => 'Pages',
			'footer_links'   => array(
				array( 'Breakdown help', '/en/help/' ),
				array( 'Services', '/en/#services' ),
				array( 'Contact', '/en/contact/' ),
			),
			'other_langs'    => array(
				array( 'Česky', '/', 'cs' ),
				array( 'Deutsch', '/de/', 'de' ),
			),
			'legal_extra'    => false,
			'404_eyebrow'    => 'Error 404',
			'404_title'      => 'We could not find this page',
			'404_lead'       => 'The page does not exist or has been moved. Try the home page, or just give us a call.',
			'404_home'       => 'Home page',
			'404_contact'    => array( 'Contact', '/en/contact/' ),
		),
	);

	return $strings[ $lang ] ?? $strings['cs'];
}

/**
 * Přípona částí šablony a vzorů: "", "-de", "-en".
 */
function ap_part_suffix( string $lang ): string {
	return 'cs' === $lang ? '' : '-' . $lang;
}

/**
 * Blok tlačítka.
 */
function ap_button_block( string $label, string $url, string $class = '', bool $blank = false ): string {
	$attrs = array();
	if ( '' !== $class ) {
		$attrs['className'] = $class;
	}
	if ( $blank ) {
		$attrs['linkTarget'] = '_blank';
		$attrs['rel']        = 'noopener';
	}
	$json  = $attrs ? ' ' . wp_json_encode( $attrs, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) : '';
	$extra = $blank ? ' target="_blank" rel="noopener"' : '';
	return '<!-- wp:button' . $json . ' --><div class="wp-block-button' . ( '' !== $class ? ' ' . esc_attr( $class ) : '' ) . '"><a class="wp-block-button__link wp-element-button" href="' . esc_url( $url ) . '"' . $extra . '>' . esc_html( $label ) . '</a></div><!-- /wp:button -->';
}

/**
 * Hlavička: logo, navigace, přepínač jazyků, telefon.
 */
function ap_part_header( string $lang ): string {
	$s    = ap_part_strings( $lang );
	$b    = ap_business_data();
	$logo = esc_url( get_theme_file_uri( 'assets/img/autopraizler-logo.svg' ) );
	$home = esc_url( home_url( $s['home'] ) );

	$nav = '';
	foreach ( $s['nav'] as $item ) {
		$attrs = array(
			'label' => $item[0],
			'url'   => esc_url( home_url( $item[1] ) ),
			'kind'  => 'custom',
		);
		if ( ! empty( $item[2] ) ) {
			$attrs['className'] = $item[2];
		}
		$nav .= '<!-- wp:navigation-link ' . wp_json_encode( $attrs, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . ' /-->';
	}

	return '<!-- wp:group {"className":"site-header","layout":{"type":"constrained"}} -->'
		. '<div class="wp-block-group site-header">'
		. '<!-- wp:group {"className":"site-header__inner","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->'
		. '<div class="wp-block-group site-header__inner">'
		. '<!-- wp:image {"width":"230px","height":"auto","linkDestination":"custom","className":"brand"} -->'
		. '<figure class="wp-block-image brand"><a href="' . $home . '"><img src="' . $logo . '" alt="' . esc_attr( $b['name'] ) . '" style="width:230px;height:auto"/></a></figure>'
		. '<!-- /wp:image -->'
		. '<!-- wp:group {"className":"site-header__nav","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->'
		. '<div class="wp-block-group site-header__nav">'
		. '<!-- wp:navigation {"overlayMenu":"mobile","hasIcon":false,"overlayBackgroundColor":"paper","overlayTextColor":"black","className":"nav","layout":{"type":"flex","justifyContent":"right","flexWrap":"nowrap"}} -->'
		. $nav
		. '<!-- /wp:navigation -->'
		. '<!-- wp:autopraizler/language-switcher /-->'
		. '<!-- wp:buttons {"className":"header-phone"} --><div class="wp-block-buttons header-phone">'
		. ap_button_block( $s['phone_label'], $b['phone_url'], 'btn-phone' )
		. '</div><!-- /wp:buttons -->'
		. '</div><!-- /wp:group -->'
		. '</div><!-- /wp:group -->'
		. '</div><!-- /wp:group -->';
}

/**
 * Patička: logo a popis, kontakt, otevřeno, odkazy, právní řádek.
 */
function ap_part_footer( string $lang ): string {
	$s    = ap_part_strings( $lang );
	$b    = ap_business_data();
	$logo = esc_url( get_theme_file_uri( 'assets/img/autopraizler-wordmark-white.svg' ) );
	$home = esc_url( home_url( $s['home'] ) );

	$list = static function ( array $items ): string {
		$out = '<!-- wp:list --><ul class="wp-block-list">';
		foreach ( $items as $item ) {
			$out .= '<!-- wp:list-item --><li>' . $item . '</li><!-- /wp:list-item -->';
		}
		return $out . '</ul><!-- /wp:list -->';
	};
	$heading = static fn ( string $text ): string => '<!-- wp:heading {"level":4} --><h4 class="wp-block-heading">' . esc_html( $text ) . '</h4><!-- /wp:heading -->';
	$column  = static fn ( string $width, string $inner ): string => '<!-- wp:column {"width":"' . $width . '"} --><div class="wp-block-column" style="flex-basis:' . $width . '">' . $inner . '</div><!-- /wp:column -->';

	$contact = array(
		'<a href="' . esc_url( $b['phone_url'] ) . '">' . esc_html( $b['phone_display'] ) . '</a>',
		'<a href="mailto:' . esc_attr( $b['email'] ) . '">' . esc_html( $b['email'] ) . '</a>',
		ap_address_html( $lang ),
	);
	$hours   = array_map( 'esc_html', ap_hours_short( $lang ) );
	$links   = array();
	foreach ( $s['footer_links'] as $item ) {
		$links[] = '<a href="' . esc_url( home_url( $item[1] ) ) . '">' . esc_html( $item[0] ) . '</a>';
	}
	$others = array();
	foreach ( $s['other_langs'] as $item ) {
		$others[] = '<a href="' . esc_url( home_url( $item[1] ) ) . '" lang="' . esc_attr( $item[2] ) . '">' . esc_html( $item[0] ) . '</a>';
	}
	$links[] = implode( ' · ', $others );

	$legal = '<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"autopraizler/copyright"}}}} --><p>© ' . esc_html( wp_date( 'Y' ) . ' ' . $b['name'] ) . '</p><!-- /wp:paragraph -->';
	if ( $s['legal_extra'] ) {
		$legal .= '<!-- wp:paragraph --><p>' . esc_html( 'Fakturační adresa: ' . $b['billing_address'] ) . '</p><!-- /wp:paragraph -->';
		$legal .= '<!-- wp:paragraph --><p><a href="' . esc_url( $b['facebook_url'] ) . '" rel="noopener">Facebook</a></p><!-- /wp:paragraph -->';
	}

	return '<!-- wp:group {"className":"site-footer","backgroundColor":"footer","style":{"spacing":{"padding":{"top":"48px","bottom":"32px"}}},"layout":{"type":"constrained"}} -->'
		. '<div class="wp-block-group site-footer has-footer-background-color has-background" style="padding-top:48px;padding-bottom:32px">'
		. '<!-- wp:columns {"className":"site-footer__cols"} --><div class="wp-block-columns site-footer__cols">'
		. $column(
			'31%',
			'<!-- wp:image {"width":"220px","height":"auto","linkDestination":"custom","className":"brand"} -->'
			. '<figure class="wp-block-image brand"><a href="' . $home . '"><img src="' . $logo . '" alt="' . esc_attr( $b['name'] ) . '" style="width:220px;height:auto"/></a></figure>'
			. '<!-- /wp:image -->'
			. '<!-- wp:paragraph --><p>' . esc_html( $s['tagline'] ) . '</p><!-- /wp:paragraph -->'
		)
		. $column( '23%', $heading( $s['h_contact'] ) . $list( $contact ) )
		. $column( '23%', $heading( $s['h_open'] ) . $list( $hours ) )
		. $column( '23%', $heading( $s['h_pages'] ) . $list( $links ) )
		. '</div><!-- /wp:columns -->'
		. '<!-- wp:group {"className":"site-footer__legal","layout":{"type":"flex","flexWrap":"wrap"}} --><div class="wp-block-group site-footer__legal">'
		. $legal
		. '</div><!-- /wp:group -->'
		. '</div><!-- /wp:group -->';
}

/**
 * Pevná mobilní lišta Zavolat + WhatsApp.
 */
function ap_part_mobile_bar( string $lang ): string {
	$s = ap_part_strings( $lang );
	$b = ap_business_data();

	return '<!-- wp:group {"className":"call-bar","layout":{"type":"default"}} --><div class="wp-block-group call-bar">'
		. '<!-- wp:buttons {"className":"call-bar__buttons"} --><div class="wp-block-buttons call-bar__buttons">'
		. ap_button_block( $s['bar_label'], $b['phone_url'], 'btn-phone' )
		. '<!-- wp:button {"className":"is-style-whatsapp btn-icon-only","rel":"noopener"} --><div class="wp-block-button is-style-whatsapp btn-icon-only"><a class="wp-block-button__link wp-element-button" href="' . esc_url( $b['whatsapp_url'] ) . '" rel="noopener">WhatsApp</a></div><!-- /wp:button -->'
		. '</div><!-- /wp:buttons -->'
		. '</div><!-- /wp:group -->';
}

/**
 * Celá stránka 404 v jazyce požadavku: hlavička, text, patička, lišta.
 */
function ap_part_404( string $lang ): string {
	$s   = ap_part_strings( $lang );
	$sfx = ap_part_suffix( $lang );

	return '<!-- wp:template-part {"slug":"header' . $sfx . '","area":"header","tagName":"header"} /-->'
		. '<!-- wp:group {"tagName":"main","className":"site-main","layout":{"type":"default"}} --><main class="wp-block-group site-main">'
		. '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"layout":{"type":"constrained","contentSize":"780px"}} -->'
		. '<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)">'
		. '<!-- wp:paragraph {"className":"eyebrow"} --><p class="eyebrow">' . esc_html( $s['404_eyebrow'] ) . '</p><!-- /wp:paragraph -->'
		. '<!-- wp:heading {"level":1} --><h1 class="wp-block-heading">' . esc_html( $s['404_title'] ) . '</h1><!-- /wp:heading -->'
		. '<!-- wp:paragraph {"className":"lead"} --><p class="lead">' . esc_html( $s['404_lead'] ) . '</p><!-- /wp:paragraph -->'
		. '<!-- wp:buttons --><div class="wp-block-buttons">'
		. ap_button_block( $s['404_home'], home_url( $s['home'] ) )
		. ap_button_block( $s['404_contact'][0], home_url( $s['404_contact'][1] ), 'is-style-outline' )
		. ap_button_block( $s['bar_label'], ap_business( 'phone_url' ), 'is-style-dark btn-phone' )
		. '</div><!-- /wp:buttons -->'
		. '</div><!-- /wp:group -->'
		. '</main><!-- /wp:group -->'
		. '<!-- wp:template-part {"slug":"footer' . $sfx . '","area":"footer","tagName":"footer"} /-->'
		. '<!-- wp:template-part {"slug":"mobile-bar' . $sfx . '","area":"uncategorized"} /-->';
}
