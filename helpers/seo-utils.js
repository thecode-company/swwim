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