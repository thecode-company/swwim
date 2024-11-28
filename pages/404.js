import Layout from '../components/layout'
import Header from '../components/header'
import Container from '../components/container'
import { fade, fadeSmallDelay, revealInNoDelay, revealInLogoNoDelay, revealInLogoMoveNoDelay, textRevealSmallDelay } from "../helpers/transitions"
import Logo from '../components/logo'
import { motion } from 'framer-motion'
import { NextSeo } from 'next-seo'
import SanityPageService from '../services/sanityPageService'
import { SmoothScrollProvider } from '../contexts/SmoothScroll.context'
import Link from 'next/link'
import Image from 'next/image'
import ImageStandard from '../helpers/image-standard'
import { PopupContext } from '../contexts/popup'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

const query = `{
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

export default function CustomError(initialData) {
  const { data: {  contact, popup }  } = pageService.getPreviewHook(initialData)()
  const [popupContext, setPopupContext] = useContext(PopupContext);
  const router = useRouter();
  const canonicalUrl = `https://www.weswwim.com${router.asPath}`;

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
    }])
  }, [])

  return (
    <Layout>
      <NextSeo
        title="404 Page Not Found"
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

      <Header contact={contact} />

      <div data-scroll-container id="scroll-container">
      <SmoothScrollProvider options={{ smooth: true, lerp: 0.07 }}>

      <motion.section
        initial="initial"
        animate="enter"
        exit="exit"
        className="bg-blue bg-noise text-white overflow-hidden h-screen flex items-center justify-center"
      >
        <motion.div variants={fadeSmallDelay} className="z-10 w-full">

          <div className="w-[55%] md:w-[28%] 2xl:w-[35%] absolute bottom-0 right-0 mr-[-12%] md:mr-[-5%] mb-[-20%] md:mb-[-6%] 2xl:mb-[-6%] z-0">
            <div className="animate--wave--slow">
              <ImageStandard width={775} height={1092} layout="responsive" src="/icons/palm-tree.svg" alt="Plant Illustration" className="w-full will-change transform scale-x-[-1]" />
            </div>
          </div>

          <div className="w-[55%] md:w-[28%] 2xl:w-[32%] absolute bottom-0 left-0 ml-[17%] md:ml-[22%] mb-[-20%] md:mb-[-6%] 2xl:mb-[-6%] z-0 2xl:max-w-[550px]">
              <ImageStandard width={775} height={1092} layout="responsive" src="/icons/404.svg" alt="Plant Illustration" className="w-full will-change transform" />
          </div>

          <img src="https://media.giphy.com/media/22CEvbj04nLLq/giphy-downsized.gif" alt="Angry Dwight Gif" className="w-full max-w-[120px] md:max-w-[200px] absolute bottom-0 right-0 transform rotate-[9deg] mr-[20%] mb-[40%] md:mb-[20%]" />

          <img src="https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy-downsized.gif" alt="Confused John Travolta Gif" className="w-full max-w-[150px] md:max-w-[240px] absolute top-0 left-0 transform rotate-[-9deg] ml-[12%] mt-[40%] md:mt-[18%]" />

          <motion.div variants={fadeSmallDelay} className="w-[65%] md:w-[44%] xl:w-[38%] 2xl:w-[35%] absolute bottom-0 left-0 ml-[-18%] md:ml-[-12%] xl:ml-[-12%] 2xl:ml-[-12%] mb-[-15%] md:mb-[-8%] xl:mb-[-8%] 2xl:mb-[-8%] z-0">
            <ImageStandard width={551} height={555} layout="responsive" src="/icons/plant-3.svg" alt="Plant Illustration" className="w-full transform -rotate-12" priority />
          </motion.div>

          <Container>
            <div className="relative mb-16 md:mb-20 2xl:mb-28 mx-[3%] md:mx-[5%] lg:mx-24 2xl:mx-32">
              <div className="overflow-hidden mb-4 md:mb-6 2xl:mb-8">
                <motion.div variants={textRevealSmallDelay}>
                  <span className="text-xl md:text-2xl 2xl:text-3xl font-display uppercase flex justify-center">
                    <span className="block mx-px animate--letter-float delay-75">4</span>
                    <span className="block mx-px animate--letter-float">0</span>
                    <span className="block mx-px animate--letter-float delay-75">4</span>
                  </span>
                </motion.div>
              </div>

              <div className="relative">
                <h1 className="block md:hidden font-display uppercase text-[9.7vw] md:text-[6.45vw] lg:text-[5.75vw] 2xl:text-[80px] leading-none relative z-10 text-center">Page Not Found</h1>

                <h1 className="hidden md:block font-display uppercase text-[9.7vw] md:text-[6.45vw] lg:text-[5.75vw] 2xl:text-[80px] leading-none relative z-10 text-center">
                  <span className="block overflow-hidden">
                    <motion.span variants={textRevealSmallDelay} className="block">
                      Page Not Found
                    </motion.span>
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-center max-w-3xl mx-auto opacity-75 mb-8 md:mb-12">Sorry, but the page you are looking for could not be found. You may have mistyped the URL, or the page may have been deleted.</p>

                <div className="flex justify-center">
                  <Link href="/">
                    <a className={`rounded-full text-center inline-block font-bold group relative overflow-hidden transition-colors ease-in-out duration-500 bg-white text-blue ring-white hover:text-white px-6 md:px-8 py-4`}>
                      <span className="block relative z-10">Return Home</span>
                      <div className="absolute bottom-0 left-0 w-full h-0 bg-black group-hover:h-full group-focus:h-full transition-all ease-in-out duration-500 z-0"></div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </motion.div>
      </motion.section>
      </SmoothScrollProvider>
      </div>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const props = await pageService.fetchQuery(context)
  return { 
    props
  };
}