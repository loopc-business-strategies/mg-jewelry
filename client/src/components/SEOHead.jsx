import { Helmet } from 'react-helmet-async';
import { brand } from '../utils/brandConfig';

export default function SEOHead({ title, description, path = '', schema, type = 'website' }) {
  const fullTitle = title ? `${title} | ${brand.name}` : `${brand.name} — Premium Jewellery Online`;
  const desc = description || brand.tagline;
  const url = `https://aurumgrove.com${path}`;

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
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  );
}
