<?php
/**
 * Title: Pásmo DE/EN pro hosty
 * Slug: autopraizler/pasmo-pro-hosty
 * Categories: autopraizler
 * Description: Oranžové pásmo „Autopanne in Marienbad? Car trouble?“ s odkazy na německou a anglickou pomoc v nouzi. Určeno jako synchronizovaný vzor na Úvod.
 * Keywords: hosté, německy, anglicky, DE, EN
 * Viewport Width: 1280
 *
 * @package AutoPraizler
 */

?>
<!-- wp:group {"align":"full","gradient":"orange","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-orange-gradient-background has-background" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)">
	<!-- wp:paragraph {"className":"eyebrow"} -->
	<p class="eyebrow">Für Kurgäste · For visitors</p>
	<!-- /wp:paragraph -->

	<!-- wp:heading -->
	<h2 class="wp-block-heading">Autopanne in Marienbad? Car trouble in Mariánské Lázně?</h2>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"className":"lead"} -->
	<p class="lead">Hotelové recepce nás doporučují hostům už léta. Německy i anglicky se domluvíte, zavolejte nebo napište na WhatsApp.</p>
	<!-- /wp:paragraph -->

	<!-- wp:columns {"className":"guests","style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
	<div class="wp-block-columns guests" style="margin-top:var(--wp--preset--spacing--50)">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:heading {"level":3} -->
			<h3 class="wp-block-heading">🇩🇪 Hilfe für Gäste</h3>
			<!-- /wp:heading -->

			<!-- wp:paragraph -->
			<p>Reifenpanne, Motor springt nicht an, Warnleuchte, Panne vor der Abreise. Rufen Sie an, wir kümmern uns darum, damit Sie rechtzeitig nach Hause kommen.</p>
			<!-- /wp:paragraph -->

			<!-- wp:buttons -->
			<div class="wp-block-buttons">
				<!-- wp:button {"className":"is-style-dark"} -->
				<div class="wp-block-button is-style-dark"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/de/hilfe/' ) ); ?>">Pannenhilfe auf Deutsch</a></div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:heading {"level":3} -->
			<h3 class="wp-block-heading">🇬🇧 Help for visitors</h3>
			<!-- /wp:heading -->

			<!-- wp:paragraph -->
			<p>Flat tyre, car won't start, warning light, breakdown before check-out. Call us, we will sort it out so you can get home on time.</p>
			<!-- /wp:paragraph -->

			<!-- wp:buttons -->
			<div class="wp-block-buttons">
				<!-- wp:button {"className":"is-style-dark"} -->
				<div class="wp-block-button is-style-dark"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/en/help/' ) ); ?>">Breakdown help in English</a></div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
