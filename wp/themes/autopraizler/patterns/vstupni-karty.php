<?php
/**
 * Title: Dvě vstupní karty
 * Slug: autopraizler/vstupni-karty
 * Categories: autopraizler
 * Description: Dva vstupy pod hero na úvodu: „Jsem na cestách“ a „Jsem z Mariánek“. Každá karta má nadpis, větu a odkaz.
 * Keywords: úvod, vstup, karty, hero
 * Viewport Width: 1180
 *
 * @package AutoPraizler
 */

?>
<!-- wp:columns {"className":"entry"} -->
<div class="wp-block-columns entry">
	<!-- wp:column -->
	<div class="wp-block-column">
		<!-- wp:heading {"level":3} -->
		<h3 class="wp-block-heading">Jsem na cestách a auto stávkuje</h3>
		<!-- /wp:heading -->

		<!-- wp:paragraph -->
		<p>Defekt, nestartuje, kontrolka, porucha před odjezdem z hotelu. Zavolejte, vyřešíme to.</p>
		<!-- /wp:paragraph -->

		<!-- wp:paragraph {"className":"go"} -->
		<p class="go"><a href="<?php echo esc_url( home_url( '/pomoc-v-nouzi/' ) ); ?>">Pomoc v nouzi →</a></p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:column -->

	<!-- wp:column {"className":"alt"} -->
	<div class="wp-block-column alt">
		<!-- wp:heading {"level":3} -->
		<h3 class="wp-block-heading">Jsem z Mariánek a okolí</h3>
		<!-- /wp:heading -->

		<!-- wp:paragraph -->
		<p>Servis, pneu, diagnostika, klima, karosárna, STK na klíč. Všechno pod jednou střechou.</p>
		<!-- /wp:paragraph -->

		<!-- wp:paragraph {"className":"go"} -->
		<p class="go"><a href="<?php echo esc_url( home_url( '/sluzby/' ) ); ?>">Naše služby →</a></p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:column -->
</div>
<!-- /wp:columns -->
