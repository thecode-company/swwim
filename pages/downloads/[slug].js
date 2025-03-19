import Layout from '../../components/layout'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Container from '../../components/container'
import { fade, fadeSmallDelay, revealInNoDelay, revealInLogoNoDelay, revealInLogoMoveNoDelay, textRevealSmallDelay } from "../../helpers/transitions"
import Logo from '../../components/logo'
import { motion } from 'framer-motion'
import { NextSeo } from 'next-seo'
import SanityPageService from '../../services/sanityPageService'
import ImageWrapper from '../../helpers/image-wrapper'
import GuidesContentWrapper from '../../components/guides-content-wrapper'
import { SmoothScrollProvider } from '../../contexts/SmoothScroll.context'
import { PopupContext } from '../../contexts/popup'
import { getRelevantSignupForm } from '../../components/signupForm';
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getRobotsFromSeo } from '../../helpers/seo-utils'

const query = `
  *[_type == "guides" && slug.current == $slug][0]{
    _id,
    seo {
      ...,
      shareGraphic {
        asset->
      },
      metaTitle,
      metaDesc,
      allowIndex,
      advancedRobots {
        allowFollow,
        allowImageIndex,
        allowArchive
      }
    },
    heroImage {
      asset -> {
        ...
      }
    },
    download {
      asset -> {
        ...
      }
    },
    content,
    introText,
    title,
    newsletterSignupHeading,
    newsletterSignupText,
    "contact": *[_type == "contact"][0] {
      title,
      email,
      phoneNumber,
      address,
      socialLinks[] {
        title,
        url
      }
    },
    "signupForms": *[_type == "signupForm"] {
      title,
      embedCode,
      pageType,
      specificPage[]-> {
        _type,
        _id
      }
    },
    "popup": *[_type == "popups"][0] {
      popupTitle,
      popupText,
      popupBannerText,
      popupImage {
        asset-> {
          ...
        }
      },
      popupEnabled,
      popupNewsletter,
      popupArticle,
      popupArticleLink-> {
        _type,
        title,
        slug {
          current
        }
      }
    }
  }
`

const pageService = new SanityPageService(query)

export default function NewsSlug(initialData) {
  const { data: { seo, heroImage, introText, title, download, content, contact, newsletterSignupHeading,
    newsletterSignupText, popup, signupForms }  } = pageService.getPreviewHook(initialData)()
  const [popupContext, setPopupContext] = useContext(PopupContext);
  const router = useRouter();
  const canonicalUrl = `https://www.weswwim.com${router.asPath}`;
  const relevantForm = getRelevantSignupForm(signupForms, 'downloads', initialData._id);
  const robotsProps = getRobotsFromSeo(seo)

  useEffect(() => {
    setPopupContext([{
      popupEnabled: popup.popupEnabled,
      bannerText: popup.popupBannerText,
      title: popup.popupTitle,
      text: popup.popupText,
      newsletter: popup.popupNewsletter,
      article: popup.popupArticle,
      articleLink: popup.popupArticleLink,
      image: popup.popupImage,
      signupForm: relevantForm
    }])
  }, [signupForms, popup, initialData._id])

  return (
    <Layout>
      <NextSeo
        title={seo?.metaTitle || title}
        description={seo?.metaDesc}
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
          title: seo?.metaTitle || title,
          description: seo?.metaDesc,
          images: [
            {
              url: seo?.shareGraphic?.asset.url || heroImage?.asset.url || '',
              width: 1200,
              height: 630,
              alt: seo?.metaTitle || title,
            },
          ]
        }}
        {...robotsProps}
      />

      <motion.div
        initial="initial"
        animate="enter"
        exit="exit"
        className="fixed inset-0 z-[100] pointer-events-none"
      >
        <motion.div variants={revealInLogoNoDelay} className="absolute inset-0 w-full h-full text-white flex items-center justify-center pointer-events-none z-[110]">
          <div className="overflow-hidden">
            <motion.div variants={revealInLogoMoveNoDelay}>
              <Logo width="w-32 md:w-48 xl:w-56" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div variants={revealInNoDelay} className="absolute inset-0 w-full h-full bg-blue-dark text-white overflow-visible">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full text-blue-dark absolute top-0 left-0 right-0 mt-[-20vw] will-change">
          <path fill="currentColor" fillOpacity="1" d="M0,224L48,192C96,160,192,96,288,106.7C384,117,480,203,576,224C672,245,768,203,864,170.7C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        </motion.div>
      </motion.div>


      <div data-scroll-container id="scroll-container">
      <SmoothScrollProvider options={{ smooth: true, lerp: 0.07 }}>

      <Header active="news" />

      <motion.section
        initial="initial"
        animate="enter"
        exit="exit"
        className="bg-blue bg-noise text-white pb-8 md:pb-16 2xl:pb-24 pt-[160px] md:pt-[190px]"
      >
        <motion.div variants={fadeSmallDelay} className="relative z-10 overflow-hidden">
          <Container>
            <div className="relative overflow-visible">
              <div className="flex flex-wrap md:-mx-6 2xl:-mx-10 lg:items-center">
                <div className="w-full md:w-1/2 md:px-6 2xl:px-12 mb-6 md:mb-0">
                  <div className="flex flex-wrap min-h-full">
                    <div className="w-full lg:py-8">

                      <h1 className="block font-display text-[7.5vw] md:text-[4.55vw] lg:text-[3.75vw] 2xl:text-[60px] leading-none relative z-10 text-left align-middle">
                        {title}
                      </h1>
                      
                      {introText && (
                        <p className="block text-lg md:text-lg lg:text-xl w-full pb-8 lg:pb-10">{introText}</p>
                      )}
                      
                      {download && (
                        <a href={download.asset.url} download="90ffd2359008d82298821d16b21778c5c39aec36.pdf" className={`rounded-full text-center font-bold px-6 md:px-8 py-2 md:py-3 bg-white text-blue hover:text-white ring-white  inline-block group overflow-hidden transition-colors ease-in-out duration-500 relative z-10`}>
                          <span className="block relative z-10">Download</span>
                          <div className="absolute bottom-0 left-0 w-full h-0 bg-blue-dark group-hover:h-full group-focus:h-full transition-all ease-in-out duration-500 z-0"></div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {heroImage?.asset && (
                  <div className="w-full md:w-1/2 md:px-6 2xl:px-10">
                    <div className="bg-blue-dark">
                      <ImageWrapper
                        image={heroImage}
                        className="w-full"
                        baseWidth={850}
                        baseHeight={710}
                        alt={title}
                        priority
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </motion.div>
      </motion.section>
      
      <motion.section
        initial="initial"
        animate="enter"
        exit="exit"
        className="bg-white bg-noise text-blue py-8 md:py-12 2xl:py-16"
      >
        <motion.div variants={fadeSmallDelay} className="relative z-10 overflow-hidden">
          <div className="lg:py-12">
            <GuidesContentWrapper text={content}  />

            {download && (
              <div className="max-w-screen-2xl mx-auto px-6 text-center mt-16 md:mt-24 lg:mt-32 xl:mt-40 mb-6 md:mb-3">
                <h3 className="text-[32px] md:text-[4.5vw] 2xl:text-[70px] font-display uppercase mb-0 pb-0">{newsletterSignupHeading ? newsletterSignupHeading : 'Download Guide'}</h3>
                
                {newsletterSignupText && (
                  <p className="text-lg md:text-xl max-w-[800px] mx-auto px-8 mb-8">{newsletterSignupText}</p>
                )}

                <a href={download.asset.url} download className={`rounded-full text-center font-bold px-6 md:px-8 py-2 md:py-3 bg-blue text-white hover:text-white ring-blue inline-block group overflow-hidden transition-colors ease-in-out duration-500 relative z-10`}>
                  <span className="block relative z-10">Download</span>
                  <div className="absolute bottom-0 left-0 w-full h-0 bg-blue-dark group-hover:h-full group-focus:h-full transition-all ease-in-out duration-500 z-0"></div>
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <motion.div variants={fadeSmallDelay} className="relative z-10 overflow-hidden">
          <Footer contact={contact} />
        </motion.div>
      </motion.section>
      </SmoothScrollProvider>
      </div>
    </Layout>
  )
}

export async function getStaticProps(context) {
  return pageService.fetchQuery(context)
}

export async function getStaticPaths() {
  const paths = await pageService.fetchPaths('guides')
  return {
    paths: paths,
    fallback: true,
  };
}