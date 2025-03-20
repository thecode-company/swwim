/**
 * Generates robots directives based on Sanity SEO settings
 * @param {Object} seo - The SEO settings from Sanity
 * @returns {Object} - Robots directives for next-seo
 */
export const getRobotsFromSeo = (seo) => {
  if (!seo) return {}
  
  const robotsProps = {}
  
  // Handle basic indexing
  if (seo.allowIndex === false) {
    robotsProps.noindex = true
  }
  
  // Handle advanced settings if they exist
  if (seo.advancedRobots) {
    if (seo.advancedRobots.allowFollow === false) {
      robotsProps.nofollow = true
    }
    
    // Build additional directives
    const additionalDirectives = []
    
    if (seo.advancedRobots.allowImageIndex === false) {
      additionalDirectives.push('noimageindex')
    }
    
    if (seo.advancedRobots.allowArchive === false) {
      additionalDirectives.push('noarchive')
    }
    
    if (additionalDirectives.length > 0) {
      robotsProps.additionalMetaTags = [
        {
          name: 'robots',
          content: additionalDirectives.join(', ')
        }
      ]
    }
  }
  
  return robotsProps
}

/**
 * Generates organization schema markup
 * @param {Object} options - Organization details
 * @returns {Object} Organization schema
 */
export function getOrganizationSchema(options = {}) {
  const defaults = {
    name: 'Swwim',
    url: 'https://www.weswwim.com/',
    logo: 'https://weswwim.com/images/social-share.jpg',
    socialProfiles: [
      'https://twitter.com/weswwim',
      'https://www.instagram.com/weswwim',
      'https://www.linkedin.com/company/swimm-social',
    ],
  };

  const data = { ...defaults, ...options };

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    sameAs: data.socialProfiles,
    ...(data.contactPoint && { contactPoint: data.contactPoint }),
  };
}

/**
 * Generates article schema markup
 * @param {Object} article - Article data
 * @returns {Object} Article schema
 */
export function getArticleSchema(article) {
  if (!article) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.image || 'https://weswwim.com/images/social-share.jpg',
    datePublished: article.date,
    dateModified: article.modified || article.date,
    author: {
      '@type': 'Person',
      name: article.author?.firstName || 'Swwim',
      url: article.author?.url || 'https://www.weswwim.com/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Swwim',
      logo: {
        '@type': 'ImageObject',
        url: 'https://weswwim.com/images/social-share.jpg',
      },
    },
    description: article.introText || '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

/**
 * Generates breadcrumbs schema markup
 * @param {Array} breadcrumbs - Array of breadcrumb items
 * @returns {Object} BreadcrumbList schema
 */
export function getBreadcrumbsSchema(breadcrumbs) {
  if (!breadcrumbs?.length) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}

/**
 * Generates FAQ schema markup
 * @param {Array} questions - Array of question/answer pairs
 * @returns {Object} FAQPage schema
 */
export function getFaqSchema(questions) {
  if (!questions?.length) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

/**
 * Utility to generate schema JSON for use in head
 * @param {Object} schema - Schema object
 * @returns {string} Stringified schema
 */
export function getSchemaString(schema) {
  if (!schema) return '';
  return JSON.stringify(schema);
}

import Head from 'next/head';
import React from 'react';

/**
 * Renders all schema.org structured data in the head
 * @param {Array} schemas - Array of schema objects
 * @returns {React.Component} Head component with schema scripts
 */
export function SchemaJsonLd({ schemas = [] }) {
  const filteredSchemas = schemas.filter(Boolean);
  
  if (!filteredSchemas.length) return null;
  
  return (
    <Head>
      {filteredSchemas.map((schema, i) => (
        <script
          key={`schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getSchemaString(schema) }}
        />
      ))}
    </Head>
  );
}

/**
 * Generates an ItemList schema for collections of items
 * @param {Array} items - Array of items to include in the list
 * @param {String} type - Type of list (e.g., 'services', 'caseStudies')
 * @returns {Object} ItemList schema
 */
export function getItemListSchema(items, type) {
  if (!items?.length) return null;
  
  const baseUrl = 'https://www.weswwim.com';
  const listItems = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.title,
    url: `${baseUrl}/${type}/${item.slug?.current}`,
    image: item.heroImage?.asset?.url || item.image?.asset?.url,
  }));
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: listItems,
    numberOfItems: items.length,
  };
} 