import React, { useContext, useEffect } from 'react'
import SanityPageService from '../../services/sanityPageService'
import NewsBody, { query, articlesPerPage } from '../../components/news-body';
import { useRouter } from 'next/router'
import { getRobotsFromSeo, getItemListSchema, SchemaJsonLd } from '../../helpers/seo-utils'
import Layout from '../../components/layout'
import { NextSeo } from 'next-seo'

const pageService = new SanityPageService(query)

export default function News(initialData) {
  const { data: { news, contact, cats, popup, numberOfArticles }  } = pageService.getPreviewHook(initialData, { start: 0, stop: articlesPerPage })()

  // Generate news list schema
  const newsListSchema = getItemListSchema(news, 'news');

  // Generate blog collection schema
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    url: 'https://www.weswwim.com/news',
    name: 'Swwim News & Insights',
    description: 'Latest news, insights and industry updates from Swwim - Social, Digital & Content Creation Agency',
    publisher: {
      '@type': 'Organization',
      name: 'Swwim',
      logo: {
        '@type': 'ImageObject',
        url: 'https://weswwim.com/images/social-share.jpg',
      }
    },
  };

  return (
    <Layout>
      <NextSeo
        title="Swwim News & Insights"
        description="Latest news, insights and industry updates from Swwim - Social, Digital & Content Creation Agency"
        openGraph={{
          url: 'https://www.weswwim.com/news',
          title: 'Swwim News & Insights',
          description: 'Latest news, insights and industry updates from Swwim - Social, Digital & Content Creation Agency',
          images: [
            {
              url: 'https://weswwim.com/images/social-share.jpg',
              width: 800,
              height: 600,
              alt: 'Swwim News & Insights',
            },
          ],
        }}
      />
      
      {/* Add Schema.org data */}
      <SchemaJsonLd schemas={[newsListSchema, blogSchema]} />

      <NewsBody news={news} cats={cats} contact={contact} popup={popup} index={1} numberOfArticles={numberOfArticles} />
    </Layout>
  )
}

export async function getStaticProps(context) {
  return pageService.fetchQuery({ params: { start: 0, stop: articlesPerPage }})
}