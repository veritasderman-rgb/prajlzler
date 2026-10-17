<?php
/**
 * Title: Patička DE
 * Slug: autopraizler/paticka-de
 * Inserter: no
 *
 * Obsah části šablony "footer-de".
 *
 * @package AutoPraizler
 */

$ap_logo = esc_url( get_theme_file_uri( 'assets/img/autopraizler-wordmark-white.svg' ) );
$ap_home = esc_url( home_url( '/de/' ) );
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
			<p>Autowerkstatt und Reifenservice in Marienbad seit 2011. Jaroslav Praizler, ID-Nr. 87674343.</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column {"width":"23%"} -->
		<div class="wp-block-column" style="flex-basis:23%">
			<!-- wp:heading {"level":4} -->
			<h4 class="wp-block-heading">Kontakt</h4>
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
				<li>U Mlékárny 844/8a<br>353 01 Mariánské Lázně, Tschechien</li>
				<!-- /wp:list-item -->
			</ul>
			<!-- /wp:list -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column {"width":"23%"} -->
		<div class="wp-block-column" style="flex-basis:23%">
			<!-- wp:heading {"level":4} -->
			<h4 class="wp-block-heading">Geöffnet</h4>
			<!-- /wp:heading -->

			<!-- wp:list -->
			<ul class="wp-block-list">
				<!-- wp:list-item -->
				<li>Mo–Do 8:00–17:00</li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li>Fr 8:00–15:00</li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li>Sa–So nach Absprache</li>
				<!-- /wp:list-item -->
			</ul>
			<!-- /wp:list -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column {"width":"23%"} -->
		<div class="wp-block-column" style="flex-basis:23%">
			<!-- wp:heading {"level":4} -->
			<h4 class="wp-block-heading">Seiten</h4>
			<!-- /wp:heading -->

			<!-- wp:list -->
			<ul class="wp-block-list">
				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/de/hilfe/' ) ); ?>">Pannenhilfe</a></li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/de/#leistungen' ) ); ?>">Leistungen</a></li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/de/kontakt/' ) ); ?>">Kontakt</a></li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" lang="cs">Česky</a> · <a href="<?php echo esc_url( home_url( '/en/' ) ); ?>" lang="en">English</a></li>
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
