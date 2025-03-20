import Image from 'next/image'
import Layout from '../../components/layout'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Link from 'next/link'
import Container from '../../components/container'
import { fade, fadeSmallDelay, revealInNoDelay, revealInLogoNoDelay, revealInLogoMoveNoDelay, textRevealSmallDelay } from "../../helpers/transitions"
import Logo from '../../components/logo'
import { motion } from 'framer-motion'
import CaseTeaser from '../../components/case-teaser'
import { NextSeo } from 'next-seo'
import SanityPageService from '../../services/sanityPageService'
import { SmoothScrollProvider } from '../../contexts/SmoothScroll.context'
import ImageStandard from '../../helpers/image-standard'
import { useContext, useEffect } from 'react'
import { getRelevantSignupForm } from '../../components/signupForm';
import { PopupContext } from '../../contexts/popup'
import { useRouter } from 'next/router'
import { getRobotsFromSeo, getItemListSchema, SchemaJsonLd } from '../../helpers/seo-utils'

const query = `{
  "cases": *[_type == "caseStudy"] | order(order asc) {
    title,
    about,
    images[] {
      asset->
    },
    deliverables[]-> {
      title
    },
    services[]-> {
      title
    },
    slug {
      current
    }
  },
  "services": *[_type == "service"] | order(order asc) {
    title,
    slug {
      current
    }
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
  },
  "seo": *[_type == "seo"][0] {
    metaTitle,
    metaDesc,
    shareGraphic {
      asset {
        url
      }
    },
    allowIndex,
    advancedRobots {
      allowFollow,
      allowImageIndex,
      allowArchive
    }
  }
}`

const pageService = new SanityPageService(query)

export default function CaseStudiesLanding(initialData) {
  const { data: { cases, contact, popup, services, signupForms, seo }  } = pageService.getPreviewHook(initialData)()
  const [popupContext, setPopupContext] = useContext(PopupContext);
  const router = useRouter();
  const canonicalUrl = `https://www.weswwim.com${router.asPath}`;
  const robotsProps = getRobotsFromSeo(seo)

  const handleChange = event => {
    if (event.target.value == 'all') {
      router.push(`/case-studies`);
    } else {
      router.push(`/case-studies/categories/${event.target.value}`);
    }
  };

  useEffect(() => {
    const relevantForm = getRelevantSignupForm(signupForms, 'case-studies');
    
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
  }, [signupForms, popup])

  // Generate case studies list schema
  const caseStudiesListSchema = getItemListSchema(cases, 'case-studies');

  // Generate collection schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Swwim Case Studies',
    description: 'Explore our work and success stories - Social, Digital & Content Creation projects by Swwim',
    url: 'https://www.weswwim.com/case-studies',
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
        title={seo?.metaTitle || "Case Studies"}
        description={seo?.metaDesc}
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
          title: seo?.metaTitle || "Case Studies",
          description: seo?.metaDesc,
          images: [
            {
              url: seo?.shareGraphic?.asset.url ?? '',
              width: 1200,
              height: 630,
              alt: seo?.metaTitle || "Case Studies",
            },
          ],
        }}
        {...robotsProps}
      />

      {/* Add Schema.org data */}
      <SchemaJsonLd schemas={[caseStudiesListSchema, collectionSchema]} />

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

      <Header theme="white" contact={contact} active="case-studies" />
      <motion.section
        initial="initial"
        animate="enter"
        exit="exit"
        className="bg-white bg-noise text-blue overflow-hidden top-padding"
      >
        <motion.div variants={fadeSmallDelay} className="relative z-10">
          <Container>
            <div className="relative overflow-visible">

              <div className="w-[24%] md:w-[20%] absolute top-0 right-0 mr-[-14%] md:mr-[-10%] 2xl:mr-[-9%] mt-[1%] z-0">
                <div className="animate--wave--slow origin-bottom-right">
                  <ImageStandard width={278} height={276} layout="responsive" src="/icons/plant-2.svg" alt="Plant Illustration" className="w-full" />
                </div>
              </div>

              <div className="w-[55%] md:w-[40%] 2xl:w-[35%] absolute top-0 left-0 ml-[-32%] md:ml-[-18%] 2xl:ml-[-13%] mt-[0%] md:mt-[0%] xl:mt-[0%] z-0">
                <div className="animate--wave--slow origin-bottom-left">
                  <ImageStandard width={551} height={555} layout="responsive" src="/icons/plant-3.svg" alt="Plant Illustration" className="w-full" />
                </div>
              </div>

              <div className="relative mb-20 md:mb-32 lg:mb-40 2xl:mb-48 mx-[3%] md:mx-[10%] lg:mx-38 2xl:mx-32">
                <div className="overflow-hidden mb-4 md:mb-6 2xl:mb-8">
                  <motion.span variants={textRevealSmallDelay} className="text-xl md:text-2xl 2xl:text-3xl font-display uppercase flex justify-center">
                    <span className="block mx-px animate--letter-float--delay">C</span>
                    <span className="block mx-px animate--letter-float">a</span>
                    <span className="block mx-px animate--letter-float--delay">s</span>
                    <span className="block mx-px animate--letter-float">e</span>
                    <span className="block mx-px animate--letter-float--delay">&nbsp;</span>
                    <span className="block mx-px animate--letter-float">S</span>
                    <span className="block mx-px animate--letter-float--delay">t</span>
                    <span className="block mx-px animate--letter-float">u</span>
                    <span className="block mx-px animate--letter-float--delay">d</span>
                    <span className="block mx-px animate--letter-float">i</span>
                    <span className="block mx-px animate--letter-float--delay">e</span>
                    <span className="block mx-px animate--letter-float">s</span>
                  </motion.span>
                </div>

                <div className="relative">
                  <h1 className="block md:hidden font-display uppercase text-[9.7vw] md:text-[6.45vw] lg:text-[5.75vw] 2xl:text-[80px] leading-none relative z-10 text-center">10's across the board</h1>

                  <h1 className="hidden md:block font-display uppercase text-[9.7vw] md:text-[6.45vw] lg:text-[5.75vw] 2xl:text-[80px] leading-none relative z-10 text-center">
                    <span className="block overflow-hidden">
                      <motion.span variants={textRevealSmallDelay} className="block">10's across the board</motion.span>
                    </span>
                  </h1>
                  
                  <div className="absolute bottom-0 left-0 w-[28%] md:w-[18%] 2xl:w-[17%] ml-[-3%] md:ml-[12%] lg:ml-[3%] 2xl:ml-[7%] mb-[6%] md:mb-[4%] lg:mb-[-5%] 2xl:mb-[-4%]">
                    <ImageStandard width={167} height={169} layout="responsive" src="/icons/case-stroke.svg" alt="Squiggle Underline" className="w-full" priority />
                  </div>
                </div>

                <div className="flex justify-center">
                  <span className="block w-auto text-center">
                    <span className="block mb-1">Filter By Service:</span>
                    <select onChange={handleChange} name="services" id="services" className="bg-blue bg-opacity-20 text-center rounded-full appearance-none font-bold w-auto py-2 focus:outline-none focus:border-none">
                      <option value={'all'}>All Services</option>
                      {services?.map((e, i) => {
                        return (
                          <option key={i} value={e.slug.current}>{e.title}</option>
                        )
                      })}
                    </select>
                  </span>
                </div>
              </div>
            </div>
          
            <div className="border-t border-current mb-12 md:mb-16 2xl:mb-24 relative z-10 px-">
              {cases.map((item, i) => {
                return (
                  <CaseTeaser
                    href={`/case-studies/${item.slug.current}`}
                    key={i}
                    index={`0${i + 1}`}
                    heading={item.title}
                    image={item.images[0]}
                    tags={item.services}
                  />
                )
              })}
            </div>

            <div className="relative md:mx-16 2xl:mx-20 mb-12 md:mb-16 2xl:mb-32">
              <svg className="w-5/12 md:w-4/12 absolute top-0 right-0 mt-[15%] mr-[2%] md:mr-[13%] lg:mr-[18%] md:mt-[18%] lg:mt-[15%] 2xl:mt-[14%] 2xl:mr-[18%] z-0" viewBox="0 0 447 258" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity=".447"><mask id="squiggleMaskA" maskUnits="userSpaceOnUse" x="0" y="0" width="447" height="258"><path fillRule="evenodd" clipRule="evenodd" d="M0 0h447v258H0V0z" fill="#fff"/></mask><g mask="url(#squiggleMaskA)"><path fillRule="evenodd" clipRule="evenodd" d="M53.828 230.687c-10.89-6.159-20.862-14.418-28.037-24.655-7.078-10.098-11.515-22.131-12.372-34.027a73.814 73.814 0 01-.172-5.233c9.767 16.713 23.923 31.084 39.348 42.517 24.188 17.925 53.103 29.06 82.627 34.699 3.62.69 7.25 1.3 10.891 1.849-1.72.121-3.441.232-5.166.321-29.476 1.522-60.958-.681-87.12-15.471zm-38.8-130.357c8.148-23.03 29.039-40.3 50.082-52.253 26.129-14.84 55.343-24.157 84.81-29.832 30.327-5.84 61.61-8.004 92.464-6.43 28.104 1.435 56.265 6.358 82.558 16.506 18.94 7.308 39.338 18.807 49.708 36.502 2.744 4.677 4.25 8.368 5.542 13.817 1.383 5.82 1.63 11.91.998 18.431-1.378 14.208-7.725 27.581-15.776 39.23-15.112 21.862-35.783 39.678-58.002 54.179-23.274 15.193-48.672 27.354-74.877 36.695-11.839 4.219-23.909 7.839-36.142 10.782-2.137.004-4.274.027-6.412-.003-31.201-.445-62.576-4.828-91.691-16.335-25.07-9.908-48.21-25.476-65.286-46.312-7.17-8.746-13.125-18.779-16.934-29.416 3.937-14.63 11.717-28.368 21.676-39.878 17.88-20.659 42.67-33.85 68.918-41.476 30.031-8.724 61.589-10.138 92.695-8.841 16.243.678 32.443 2.126 48.609 3.817 3.082.323 5.725-2.836 5.725-5.672 0-3.334-2.636-5.348-5.725-5.671-34.274-3.582-68.954-6.115-103.336-2.416-30.385 3.269-60.75 11.556-86.644 28.061-19.82 12.636-36.243 30.36-46.323 51.436-.536-8.297.453-16.694 3.363-24.921zm431.207 63.482c-1.465-2.48-5.29-3.8-7.835-2.034a429.465 429.465 0 01-77.083 42.449c-26.732 11.329-54.754 19.834-83.242 25.549a423.547 423.547 0 01-34.641 5.446 404.608 404.608 0 0033.575-14.547c25.653-12.51 50.162-27.985 71.071-47.409 21.628-20.095 41.423-45.688 44.52-75.785 1.307-12.71-1.046-25.588-7.191-36.847-5.545-10.158-13.889-18.415-23.165-25.264-19.627-14.492-44.136-22.736-67.791-28.016C262.398.201 229.157-1.277 196.445.967c-31.951 2.19-63.885 7.67-94.157 18.2C74.9 28.695 47.45 41.937 26.751 62.543 17.217 72.03 9.38 83.129 4.585 95.687c-5.194 13.611-5.805 28.477-2.692 42.638.61 2.789 1.395 5.52 2.26 8.22-5.062 22.418-1.606 46.334 11.959 65.51 17.163 24.263 45.16 37.95 74.085 42.916 32.283 5.541 66.037 2.964 97.969-3.56 3.065-.625 6.115-1.329 9.159-2.039 11.665-.057 23.323-.637 34.901-1.649 30.533-2.667 60.794-8.471 90.096-17.384 29.268-8.904 57.66-20.834 84.426-35.562a427.403 427.403 0 0037.434-23.205c2.528-1.754 3.704-4.962 2.053-7.76z" fill="#EEE1D9"/></g></g></svg>
              
              <div className="w-[32%] md:w-[30%] lg:w-[20%] absolute top-0 left-0 ml-[-16%] md:ml-[-24%] lg:ml-[-20%] 2xl:ml-[-20%] mt-[2%] md:mt-[15%] lg:mt-[30%] z-0 transform rotate-45">
                <div className="animate--wave--slow origin-bottom-left">
                  <ImageStandard width={278} height={276} layout="responsive" src="/icons/plant-2.svg" alt="Plant Illustration" className="w-full transform rotate-90" />
                </div>
              </div>

              <div className="w-[65%] md:w-[65%] lg:w-[50%] 2xl:w-[45%] absolute top-0 right-0 mr-[-33%] md:mr-[-37%] lg:mr-[-27%] 2xl:mr-[-30%] mt-[-35%] md:mt-[-35%] lg:mt-[-25%] xl:mt-[-25%] z-0 transform rotate-45">
                <div className="animate--wave--slow origin-bottom-right">
                  <ImageStandard width={551} height={555} layout="responsive" src="/icons/palm-tree.svg" alt="Plant Illustration" className="w-full transform -rotate-90" />
                </div>
              </div>

              <span className="font-display uppercase text-[10.5vw] md:text-[8.5vw] 2xl:text-[125px] leading-none relative z-10 flex items-center">
                <span className="block">
                  See How We
                </span>
                {/* <div className="w-[13%] xl:w-[11%] mr-l md:ml-[2%] 2xl:ml-[4%] xl:mb-[-2%] hidden md:block animate--float">
                  <ImageStandard width={130} height={115} layout="responsive" src="/icons/speech.svg" alt="Speech Bubble Illustration" className="w-full" />
                </div> */}
                <div className="w-[13%] md:w-[23vw] lg:w-[28vw] md:h-[5.3vw] lg:h-[5vw] xl:w-[35%] xl:mb-[-2%] hidden md:block mt-[10px] xl:mt-[15px] xl:h-[88px] absolute top-0 right-0">
                  <ImageStandard layout="fill" src="/images/case-image.png" alt="See how we can help" className="w-full absolute inset-0 object-cover object-center" />
                </div>
              </span>

              <span className="md:text-right font-display uppercase text-[10.5vw] md:text-[8.5vw] 2xl:text-[125px] leading-none relative z-10 flex items-center justify-end">
                <div className="w-[11%] mr-3 md:mr-[4%] 2xl:mr-12 hidden md:block animate--float animate--stagger">
                  <ImageStandard width={157} height={134} layout="responsive" src="/icons/camera-coloured.svg" alt="Camera Illustration" className="w-full" />
                </div>
                <span className="block">
                  Can Help Your
                </span>
              </span>
              <span className="block font-display uppercase text-[10.5vw] md:text-[8.5vw] 2xl:text-[125px] leading-none relative z-10">Business Grow</span>

              <div className="w-[32%] mr-3 md:mr-[4%] 2xl:mr-12 block absolute bottom-0 left-0 z-10 -mb-2 xl:mb-0">
                <ImageStandard width={364} height={181} layout="responsive" src="/icons/case-woman.svg" alt="Woman Illustration" className="w-full" />
              </div>
              
              <span className="block font-display uppercase text-[10.5vw] md:text-[8.5vw] 2xl:text-[125px] leading-none relative z-10 ml-[35%]">Today</span>
              
              <Link href="/contact">
                <a className={`rounded-full text-center inline-block font-bold group overflow-hidden transition-colors ease-in-out duration-500 bg-blue text-white ring-blue px-4 md:px-6 py-4 md:py-6 relative xl:absolute xl:bottom-0 xl:right-0 w-full xl:w-[30%] text-base md:text-2xl xl:text-[1.9vw] mt-5 xl:mt-0 xl:mb-6 xl:max-w-[360px]`}>
                  <span className="block relative z-10 xl:mb-2">Contact us</span>
                  <div className="absolute bottom-0 left-0 w-full h-0 bg-blue-dark group-hover:h-full group-focus:h-full transition-all ease-in-out duration-500 z-0"></div>
                </a>
              </Link>
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