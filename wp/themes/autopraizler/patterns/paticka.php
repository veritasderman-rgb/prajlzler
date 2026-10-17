<?php
/**
 * Title: Patička CZ
 * Slug: autopraizler/paticka
 * Inserter: no
 *
 * Obsah části šablony "footer". Texty kontaktu a otevírací doby jsou tady
 * natvrdo (patička je součást šablony, upravuje ji správce webu).
 *
 * @package AutoPraizler
 */

$ap_logo = esc_url( get_theme_file_uri( 'assets/img/autopraizler-wordmark-white.svg' ) );
$ap_home = esc_url( home_url( '/' ) );
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
			<p>Autoservis a pneuservis v Mariánských Lázních od roku 2011. Jaroslav Praizler, IČO 87674343.</p>
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
				<li>U Mlékárny 844/8a<br>353 01 Mariánské Lázně</li>
				<!-- /wp:list-item -->
			</ul>
			<!-- /wp:list -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column {"width":"23%"} -->
		<div class="wp-block-column" style="flex-basis:23%">
			<!-- wp:heading {"level":4} -->
			<h4 class="wp-block-heading">Otevřeno</h4>
			<!-- /wp:heading -->

			<!-- wp:list -->
			<ul class="wp-block-list">
				<!-- wp:list-item -->
				<li>Po–Čt 8:00–17:00</li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li>Pá 8:00–15:00</li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li>So–Ne po domluvě</li>
				<!-- /wp:list-item -->
			</ul>
			<!-- /wp:list -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column {"width":"23%"} -->
		<div class="wp-block-column" style="flex-basis:23%">
			<!-- wp:heading {"level":4} -->
			<h4 class="wp-block-heading">Web</h4>
			<!-- /wp:heading -->

			<!-- wp:list -->
			<ul class="wp-block-list">
				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/pomoc-v-nouzi/' ) ); ?>">Pomoc v nouzi</a></li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/sluzby/' ) ); ?>">Služby</a></li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/cenik/' ) ); ?>">Ceník</a></li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/o-nas/' ) ); ?>">O nás</a></li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/recenze/' ) ); ?>">Recenze</a></li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/kontakt/' ) ); ?>">Kontakt</a></li>
				<!-- /wp:list-item -->

				<!-- wp:list-item -->
				<li><a href="<?php echo esc_url( home_url( '/de/' ) ); ?>" lang="de">Deutsch</a> · <a href="<?php echo esc_url( home_url( '/en/' ) ); ?>" lang="en">English</a></li>
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

		<!-- wp:paragraph -->
		<p>Fakturační adresa: U Hřiště 280, 353 01 Velká Hleďsebe</p>
		<!-- /wp:paragraph -->

		<!-- wp:paragraph -->
		<p><a href="https://www.facebook.com/people/AutoPraizler-ML/100064057664199/" rel="noopener">Facebook</a></p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
