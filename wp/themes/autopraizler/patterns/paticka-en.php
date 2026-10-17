<?php
/**
 * Title: Patička EN
 * Slug: autopraizler/paticka-en
 * Inserter: no
 *
 * Obsah části šablony "footer-en".
 *
 * @package AutoPraizler
 */

$ap_logo = esc_url( get_theme_file_uri( 'assets/img/autopraizler-wordmark-white.svg' ) );
$ap_home = esc_url( home_url( '/en/' ) );
?>
<!-- wp:group {"className":"site-footer","backgroundColor":"footer","style":{"spacing":{"padding":{"top":"48px","bottom":"32px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group site-footer has-footer-background-color has-background" style="padding-top:48px;padding-bottom:32px">
	<!-- wp:columns {"className":"site-footer__cols"} -->
	<div class="wp-block-columns site-footer__cols">
		<!-- wp:column {"width":"31%"} -->
		<div class="wp-block-column" style="flex-basis:31%">
			<!-- wp:image {"width":"220px","height":"auto","linkDestination":"custom","className":"brand"} -->
			<figure class="wp-block-image brand"><a href="<?php echo $ap_home; ?>"><img src="<?php echo $ap_logo; ?>" alt="AutoPraizler M.L." style="width:220px;height:auto"/></a></figure>
			<!-- /wp:image -->

			<!-- wp:paragraph -->
			<p>Car repair and tyre service in Mariánské Lázně since 2011. Jaroslav Praizler, company ID 87674343.</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column {"width":"23%"} -->
		<div class="wp-block-column" style="flex-basis:23%">
			<!-- wp:heading {"level":4} -->
			<h4 class="wp-block-heading">Contact</h4>
			<!-- /wp:heading -->

			<!-- wp:list -->
			<ul class="wp-block-list">
				<!-- wp:list-item -->
				<li><a href="tel:+420728920290">+420 728 920 290</a></li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li><a href="mailto:servis@autopraizler.cz">servis@autopraizler.cz</a></li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li>U Mlékárny 844/8a<br>353 01 Mariánské Lázně, Czech Republic</li>
				<!-- /wp:list-item -->
			</ul>
			<!-- /wp:list -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column {"width":"23%"} -->
		<div class="wp-block-column" style="flex-basis:23%">
			<!-- wp:heading {"level":4} -->
			<h4 class="wp-block-heading">Open</h4>
			<!-- /wp:heading -->

			<!-- wp:list -->
			<ul class="wp-block-list">
				<!-- wp:list-item -->
				<li>Mon–Thu 8:00–17:00</li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li>Fri 8:00–15:00</li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li>Sat–Sun by arrangement</li>
				<!-- /wp:list-item -->
			</ul>
			<!-- /wp:list -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column {"width":"23%"} -->
		<div class="wp-block-column" style="flex-basis:23%">
			<!-- wp:heading {"level":4} -->
			<h4 class="wp-block-heading">Pages</h4>
			<!-- /wp:heading -->

			<!-- wp:list -->
			<ul class="wp-block-list">
				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/en/help/' ) ); ?>">Breakdown help</a></li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/en/#services' ) ); ?>">Services</a></li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/en/contact/' ) ); ?>">Contact</a></li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" lang="cs">Česky</a> · <a href="<?php echo esc_url( home_url( '/de/' ) ); ?>" lang="de">Deutsch</a></li>
				<!-- /wp:list-item -->
			</ul>
			<!-- /wp:list -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->

	<!-- wp:group {"className":"site-footer__legal","layout":{"type":"flex","flexWrap":"wrap"}} -->
	<div class="wp-block-group site-footer__legal">
		<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"autopraizler/copyright"}}}} -->
		<p>© 2026 AutoPraizler M.L.</p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
