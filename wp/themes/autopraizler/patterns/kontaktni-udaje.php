<?php
/**
 * Title: Kontaktní údaje
 * Slug: autopraizler/kontaktni-udaje
 * Categories: autopraizler
 * Description: Telefon, WhatsApp, e-mail, adresa, GPS a tlačítka Navigovat. Určeno jako synchronizovaný vzor „Kontaktní údaje“: změna na jednom místě se projeví všude.
 * Keywords: kontakt, telefon, adresa, gps
 * Viewport Width: 600
 *
 * Výchozí hodnoty se berou z inc/business.php při vložení; po vložení je
 * text kopií v databázi (viz README).
 *
 * @package AutoPraizler
 */

$ap_b = ap_business_data();
?>
<!-- wp:table {"hasFixedLayout":false,"className":"kontakt"} -->
<figure class="wp-block-table kontakt"><table><tbody><tr><td>Telefon</td><td><a href="<?php echo esc_url( $ap_b['phone_url'] ); ?>"><?php echo esc_html( $ap_b['phone_display'] ); ?></a><br>příjem oprav</td></tr><tr><td>WhatsApp</td><td><a href="<?php echo esc_url( $ap_b['whatsapp_url'] ); ?>" rel="noopener"><?php echo esc_html( $ap_b['phone_display'] ); ?></a></td></tr><tr><td>E-mail</td><td><a href="mailto:<?php echo esc_attr( $ap_b['email'] ); ?>"><?php echo esc_html( $ap_b['email'] ); ?></a></td></tr><tr><td>Provozovna</td><td><?php echo esc_html( $ap_b['street'] ); ?><br><?php echo esc_html( $ap_b['postal_code'] . ' ' . $ap_b['city'] . ' – ' . $ap_b['district'] ); ?></td></tr><tr><td>GPS</td><td><?php echo esc_html( $ap_b['gps_display'] ); ?></td></tr></tbody></table></figure>
<!-- /wp:table -->

<!-- wp:buttons -->
<div class="wp-block-buttons">
	<!-- wp:button {"linkTarget":"_blank","rel":"noopener"} -->
	<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( $ap_b['directions_url'] ); ?>" target="_blank" rel="noopener">Navigovat (Google Maps)</a></div>
	<!-- /wp:button -->

	<!-- wp:button {"className":"is-style-outline","linkTarget":"_blank","rel":"noopener"} -->
	<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( $ap_b['mapy_url'] ); ?>" target="_blank" rel="noopener">Mapy.com</a></div>
	<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
