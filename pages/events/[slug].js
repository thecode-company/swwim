import Link from 'next/link'
import Image from 'next/image'
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
import spacetime from 'spacetime'
import GuidesContentWrapper from '../../components/guides-content-wrapper'
import { SmoothScrollProvider } from '../../contexts/SmoothScroll.context'
import { useContext, useEffect } from 'react'
import { PopupContext } from '../../contexts/popup'
import { getRelevantSignupForm } from '../../components/signupForm';
import { useRouter } from 'next/router'

const readingTime = require('reading-time');


const query = `
  *[_type == "events" && slug.current == $slug][0]{
    _id,
    seo {
      ...,
      shareGraphic {
        asset->
      }
    },
    heroImage {
      asset -> {
        ...
      }
    },
    content,
    date,
    time,
    location,
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
      specificPage-> {
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

function toPlainText(blocks = []) {
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      return block.children.map(child => child.text).join('')
    })
    .join('\n\n')
}

const pageService = new SanityPageService(query)

export default function NewsSlug(initialData) {
  const { data: { seo, heroImage, date, location, time, introText, title, content, newsletterSignupHeading, newsletterSignupText, contact, popup, signupForms }  } = pageService.getPreviewHook(initialData)()
  const router = useRouter();
  const canonicalUrl = `https://www.weswwim.com${router.asPath}`;
  const relevantForm = getRelevantSignupForm(signupForms, 'events', initialData._id);
  
  // Extract form parts using the existing utility functions from _app.js
  const formAction = extractFormAction(relevantForm.embedCode);
  const hiddenFields = extractHiddenFields(relevantForm.embedCode);
  const honeypotField = extractHoneypotField(relevantForm.embedCode);
  
  const [popupContext, setPopupContext] = useContext(PopupContext);

  useEffect(() => {
    setPopupContext([{
      popupEnabled: popup.popupEnabled,
      title: popup.popupTitle,
      bannerText: popup.popupBannerText,
      text: popup.popupText,
      newsletter: popup.popupNewsletter,
      article: popup.popupArticle,
      articleLink: popup.popupArticleLink,
      image: popup.popupImage,
      signupForm: relevantForm
    }])
  }, [signupForms, popup, initialData._id])

  let d = spacetime(date)
  let estimatedReadingTime = readingTime(toPlainText(content));

  return (
    <Layout>
      <NextSeo
        title={seo?.metaTitle ? seo?.metaTitle : title }
        description={seo?.metaDesc ? seo?.metaDesc : introText}
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
          images: [
            {
              url: seo?.shareGraphic?.asset.url ?? null,
              width: 1200,
              height: 630
            },
          ]
        }}
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
              {heroImage?.asset && (
                  <div className="w-full md:w-1/2 md:px-6 2xl:px-10 order-2 md:order-1">
                    <div className="bg-blue-dark">
                      <ImageWrapper
                        image={heroImage}
                        className="w-full"
                        baseWidth={720}
                        baseHeight={570}
                        alt={title}
                        priority
                      />
                    </div>
                  </div>
                )}

                <div className="w-full md:w-1/2 md:px-6 2xl:px-12 mb-6 md:mb-0 order-1 md:order-2">
                  <div className="flex flex-wrap min-h-full">
                    <div className="w-full lg:py-8">

                      <h1 className="block font-display text-[7.5vw] md:text-[4.55vw] lg:text-[3.75vw] 2xl:text-[55px] leading-none relative z-10 text-left align-middle">
                        {title}
                      </h1>
                      
                      {introText && (
                        <p className="block text-lg md:text-lg lg:text-xl w-full pb-8 lg:pb-10">{introText}</p>
                      )}

                      <div className="w-full h-px bg-white mb-8 lg:mb-10"></div>
                      
                      <div className="flex">
                        {date && (
                          <div className="w-1/3">
                            <span className="block mb-1">Date</span>
                            <span className={`font-display text-base md:text-lg mb-1 block`}>{d.unixFmt('dd.MM.yy')}</span>
                          </div>
                        )}
                        {time && (
                          <div className="w-1/3">
                            <span className="block mb-1">Time</span>
                            <span className={`font-display text-base md:text-lg mb-1 block`}>{time}</span>
                          </div>
                        )}
                        {location && (
                          <div className="w-1/3">
                            <span className="block mb-1">Location</span>
                            <span className={`font-display text-base md:text-lg mb-1 block`}>{location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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
          <div className="lg:py-12 mb-20 lg:mb-32">
            <GuidesContentWrapper text={content} full />
          </div>
          
          <div className="text-center flex flex-wrap justify-center">
            <div className="mb-12 lg:mb-20 w-full">
              <h2 className="font-display text-5xl md:text-[6.45vw] lg:text-[5.75vw] 2xl:text-[80px] leading-none uppercase mb-1 lg:mb-3">{newsletterSignupHeading ? newsletterSignupHeading : 'Register your interest'}</h2>
              <p className="text-lg lg:text-xl">{newsletterSignupText ? newsletterSignupText : 'Register your interest below and we will be in touch.'}</p>
            </div>
            
            <div className="w-10/12 lg:w-8/12 max-w-2xl mx-auto mb-20 lg:mb-32">
              <form action={extractFormAction(popupContext[0].signupForm.embedCode)} method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate w-full relative" target="_blank">
                <div className="mc-field-group w-full">
                  <label htmlFor="mce-EMAIL" className="hidden">Email Address  <span className="inline">*</span></label>
                  <input type="email" placeholder="Email Address" name="EMAIL" className="required email w-full border border-blue border-opacity-50 rounded-full p-[12px] md:p-[14px] px-6 pr-[130px] pl-5 md:pl-6 md:pr-40 text-blue placeholder-blue placeholder-opacity-50" id="mce-EMAIL" required />
                </div>
                <div id="mce-responses">
                  <div className="hidden" id="mce-error-response"></div>
                  <div className="hidden" id="mce-success-response"></div>
                </div> 

                {/* Honeypot field */}
                <div dangerouslySetInnerHTML={{ 
                  __html: extractHoneypotField(popupContext[0].signupForm.embedCode)
                }} />  

                {/* Insert hidden fields from the Mailchimp form */}
                <div hidden="" dangerouslySetInnerHTML={{ __html: hiddenFields }} />

                <button type="submit" className={`rounded-full text-center font-bold px-8 md:px-[34px] py-[11px] bg-blue text-white ring-blue block group overflow-hidden transition-colors ease-in-out duration-500 z-10 absolute top-0 right-0 mt-1 mr-1 text-sm md:text-base`} name="subscribe" id="mc-embedded-subscribe">
                  <span className="block relative z-10">Sign Up</span>
                  <div className="absolute bottom-0 left-0 w-full h-0 bg-blue-dark group-hover:h-full group-focus:h-full transition-all ease-in-out duration-500 z-0"></div>
                </button>
              </form>
            </div>
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
  const paths = await pageService.fetchPaths('events')
  return {
    paths: paths,
    fallback: true,
  };
}