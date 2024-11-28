import { useContext, useEffect } from 'react'
import Layout from '../components/layout'
import Header from '../components/header'
import Footer from '../components/footer'
import Container from '../components/container'
import { fade, fadeSmallDelay, revealInNoDelay, revealInLogoNoDelay, revealInLogoMoveNoDelay, textRevealSmallDelay } from "../helpers/transitions"
import Logo from '../components/logo'
import { motion } from 'framer-motion'
import SanityPageService from '../services/sanityPageService'
import { NextSeo } from 'next-seo'
import { SmoothScrollProvider } from '../contexts/SmoothScroll.context'
import LegalTabs from '../components/legal-tabs'
import { PopupContext } from '../contexts/popup'
import { useRouter } from 'next/router'

const query = `{
  "legal": *[_type == "legal"] {
    title,
    content
  },
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
}`

const pageService = new SanityPageService(query)

export default function Legal(initialData) {
  const { data: { legal, contact, popup }  } = pageService.getPreviewHook(initialData)()
  const [popupContext, setPopupContext] = useContext(PopupContext);
  const router = useRouter();
  const canonicalUrl = `https://www.weswwim.com${router.asPath}`;

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
    }])
  }, [])

  return (
    <Layout>
      <NextSeo
        title="Legal"
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
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

      <Header contact={contact} />

      <motion.section
        initial="initial"
        animate="enter"
        exit="exit"
        className="bg-blue bg-noise text-white overflow-hidden pt-[160px] md:pt-[190px]"
      >
        <motion.div variants={fadeSmallDelay} className="relative z-10">
          <Container>
            <div className="relative mb-16 md:mb-20 2xl:mb-28 mx-[3%] md:mx-[5%] lg:mx-24 2xl:mx-32">
              <div className="overflow-hidden mb-4 md:mb-6 2xl:mb-8">
                <motion.div variants={textRevealSmallDelay}>
                  <span className="text-xl md:text-2xl 2xl:text-3xl font-display uppercase flex justify-center">
                    <span className="block mx-px animate--letter-float delay-75">L</span>
                    <span className="block mx-px animate--letter-float">e</span>
                    <span className="block mx-px animate--letter-float delay-75">g</span>
                    <span className="block mx-px animate--letter-float">a</span>
                    <span className="block mx-px animate--letter-float delay-75">l</span>
                  </span>
                </motion.div>
              </div>

              <div className="relative">
                <h1 className="block md:hidden font-display uppercase text-[9.7vw] md:text-[6.45vw] lg:text-[5.75vw] 2xl:text-[80px] leading-none relative z-10 text-center">Terms &amp; Conditions</h1>

                <h1 className="hidden md:block font-display uppercase text-[9.7vw] md:text-[6.45vw] lg:text-[5.75vw] 2xl:text-[80px] leading-none relative z-10 text-center">
                  <span className="block overflow-hidden">
                    <motion.span variants={textRevealSmallDelay} className="block">
                      Terms &amp; Conditions
                    </motion.span>
                  </span>
                </h1>
              </div>
            </div>
          </Container>

          <Container>
            <div className="relative z-10 overflow-visible pb-12 md:pb-32 2xl:pb-40">
              <LegalTabs items={legal}></LegalTabs>
            </div>
          </Container>
        </motion.div>
      
        <motion.div variants={fadeSmallDelay} className="relative z-10">
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