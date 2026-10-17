<?php
/**
 * Title: Výzva Zavolat
 * Slug: autopraizler/vyzva-zavolat
 * Categories: autopraizler
 * Description: Pásmo na konec stránky: nadpis, jedna věta, tlačítka Zavolat a WhatsApp. Vhodné jako synchronizovaný vzor (jedna pravda pro celý web).
 * Keywords: zavolat, cta, výzva, whatsapp
 * Viewport Width: 1180
 *
 * Telefon a WhatsApp z inc/business.php (při vložení).
 *
 * @package AutoPraizler
 */

$ap_b = ap_business_data();
?>
<!-- wp:group {"align":"full","className":"cta-band","backgroundColor":"sand","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull cta-band has-sand-background-color has-background" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)">
	<!-- wp:heading {"textAlign":"center"} -->
	<h2 class="wp-block-heading has-text-align-center">Chcete vědět, kolik to bude stát?</h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center","className":"lead"} -->
	<p class="has-text-align-center lead">Zavolejte nebo napište, co auto potřebuje. Orientační cenu řekneme hned, přesnou po prohlídce. Žádná překvapení na faktuře.</p>
	<!-- /wp:paragraph -->

	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
	<div class="wp-block-buttons">
		<!-- wp:button {"className":"btn-phone"} -->
		<div class="wp-block-button btn-phone"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( $ap_b['phone_url'] ); ?>">Zavolat <?php echo esc_html( $ap_b['phone_short'] ); ?></a></div>
		<!-- /wp:button -->

		<!-- wp:button {"className":"is-style-whatsapp","rel":"noopener"} -->
		<div class="wp-block-button is-style-whatsapp"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( $ap_b['whatsapp_url'] ); ?>" rel="noopener">Napsat na WhatsApp</a></div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
