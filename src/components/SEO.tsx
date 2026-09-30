import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = 'Quality building materials, hardware and construction supplies in Rahim Yar Khan. DG Khan cement, Grade 60 steel, tiles, paints, plumbing, and tools.',
  canonicalPath
}) => {
  const fullTitle = title
    ? `${title} | Al Mushtaq Building Material Store`
    : 'Al Mushtaq Building Material Store | Construction Materials Rahim Yar Khan';

  useEffect(() => {
    document.title = fullTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }

    // Scroll to top smoothly on new route mount
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [fullTitle, description]);

  return null;
};
