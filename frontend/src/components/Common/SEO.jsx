import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Spylink Networks - Fast & Reliable Internet in Kenya',
  description = 'Experience lightning-fast fiber internet with Spylink Networks. Best ISP in Kenya offering affordable home and business internet packages with 24/7 support.',
  keywords = 'internet provider Kenya, fiber internet, home internet, business internet, Spylink Networks, ISP Kenya',
  image = '/spylink-og-image.jpg',
  url = 'https://spylink.co.ke',
}) => {
  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Spylink Networks" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </Helmet>
  );
};

export default SEO;