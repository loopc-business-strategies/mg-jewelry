import { Helmet } from 'react-helmet-async';
import { brand } from '../utils/brandConfig';

export default function SEOHead({ title, description, path = '', schema, type = 'website', image }) {
  const fullTitle = title
    ? `${title} | ${brand.name}`
    : `${brand.name} — International Jewelry Manufacturing`;
  const desc = description || `${brand.tagline} ${brand.heroSubtitle.slice(0, 120)}...`;
  const url = `${brand.siteUrl}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={brand.name} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  );
}
