import Image from 'next/image'
import Link from 'next/link'
import Layout from '../../components/layout'
import Header from '../../components/header'
import Container from '../../components/container'
import { fade, fadeSmallDelay, revealInNoDelay, revealInLogoNoDelay, revealInLogoMoveNoDelay, textRevealSmallDelay } from "../../helpers/transitions"
import Logo from '../../components/logo'
import { motion } from 'framer-motion'
import { NextSeo } from 'next-seo'
import ScrollToContent from '../../components/scroll-to-content'
import SanityPageService from '../../services/sanityPageService'
import ImageWrapper from '../../helpers/image-wrapper'
import CaseCarousel from '../../components/case-carousel'
import GuidesContentWrapper from '../../components/guides-content-wrapper'
import { SmoothScrollProvider } from '../../contexts/SmoothScroll.context'
import Footer from '../../components/footer'
import { useContext, useEffect } from 'react'
import { PopupContext } from '../../contexts/popup'
import { useRouter } from 'next/router';

const query = `*[_type == "caseStudy" && slug.current == $slug][0]{
  seo {
    ...,
    shareGraphic {
      asset->
    }
  },
  order,
  title,
  about,
  content,
  images[] {
    asset->
  },
  deliverables[]-> {
    title
  },
  stats[] {
    statHeading,
    statText
  },
  services[]-> {
    title,
    slug {
      current
    }
  },
  slug {
    current
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
  "nextCase": *[_type == "caseStudy" && slug.current != $slug && order > ^.order] | order(order asc)[0] {
    title,
    images[] {
      asset->
    },
    deliverables[]-> {
      title
    },
    services[]-> {
      title,
      slug {
        current
      }
    },
    slug {
      current
    }
  },
  "firstCase": *[_type == "caseStudy" && slug.current != $slug] | order(order asc)[0] {
    title,
    images[] {
      asset->
    },
    deliverables[]-> {
      title
    },
    services[]-> {
      title,
      slug {
        current
      }
    },
    slug {
      current
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

export default function CaseStudySlug(initialData) {
  const { data: { seo, title, about, images, stats, services, content, slug, contact, nextCase, firstCase, popup }  } = pageService.getPreviewHook(initialData)()
  const [popupContext, setPopupContext] = useContext(PopupContext);
  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

  const canonicalUrl = `https://www.yourdomain.com${router.asPath}`;

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
        title={seo?.metaTitle ? seo?.metaTitle : title }
        description={seo?.metaDesc ? seo?.metaDesc : about}
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
          <Header theme="white" pinned active="case-studies" />

          <motion.section
            initial="initial"
            animate="enter"
            exit="exit"
            className="bg-white bg-noise text-blue overflow-hidden w-full md:min-h-screen pb-24 md:pb-0 relative"
          >
            <motion.div variants={fadeSmallDelay} className="relative z-20">
              <div className="flex flex-wrap md:max-h-screen md:fixed md:left-auto md:right-0 md:top-0 md:bottom-0 md:w-1/2 md:z-20">
                <div className="w-full relative z-20">
                  {images?.length > 0 && (
                    <>
                      <div className="block md:hidden bg-blue h-[50vh] w-full object-cover max-h-screen">
                        <CaseCarousel images={images} />
                      </div>
                      <div className="hidden md:block bg-blue w-full h-full object-cover max-h-screen">
                        <CaseCarousel images={images} />
                        {/* <ImageWrapper
                          image={images[0]}
                          className="w-full h-full object-cover max-h-screen"
                          baseWidth={730}
                          baseHeight={1000}
                          alt={title}
                          fill="cover"
                        /> */}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Container>
                <div className="flex flex-wrap md:min-h-screen relative md:z-10">
                  <div className="w-full md:w-1/2 py-8 md:pt-32 md:pb-12 2xl:pt-40 2xl:pb-16 flex items-center">
                    <div className="w-11/12 md:w-10/12">
                      <Link href="/case-studies">
                        <a className="flex flex-wrap space-x-3 items-center ring-white mb-8 md:mb-12 2xl:mb-16 group">

                        <span className="border border-blue border-opacity-30 rounded-full relative overflow-hidden group-hover:border-opacity-100 ease-in-out transition-all duration-500 transform rotate-90">
                          <svg className="absolute top-0 left-0 -translate-y-12 group-hover:translate-y-0 transition ease-in-out duration-500 w-8 transform rotate-180" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 16.57l-6.188-6.232-6.188 6.231M17.812 10.338V25" stroke="currentColor" strokeWidth="1.008"/></svg>

                          <svg className="group-hover:translate-y-12 transition ease-in-out duration-500 w-8 transform rotate-180" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 16.57l-6.188-6.232-6.188 6.231M17.812 10.338V25" stroke="currentColor" strokeWidth="1.008"/></svg>
                        </span>
                          
                          {/* <svg className="w-8 transform -rotate-90 group-hover:scale-125 transition-transform ease-in-out duration-300" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><circle opacity=".324" cx="17.5" cy="17.5" r="16.5" transform="rotate(-180 17.5 17.5)" stroke="currentColor" strokeWidth="1.12"/><path d="M24 16.57l-6.188-6.232-6.188 6.231M17.812 10.338V25" stroke="currentColor" strokeWidth="1.008"/></svg> */}
                          <span className="block font-bold transition-opacity ease-in-out duration-300 group-hover:opacity-60">Back to case studies</span>
                        </a>
                      </Link>

                      <h1 className="font-display block text-[42px] md:text-[5.7vw] 2xl:text-[85px] leading-none mb-5 md:mb-8 2xl:mb-12 pb-0">{title}</h1>

                      { services?.length > 0 && (
                        <div className="mb-5 md:mb-8">
                          <span className="block font-bold text-lg md:text-xl mb-1 xl:text-2xl">Deliverables:</span>

                          <p className="block max-w-lg md:text-lg">
                          {services.map((item, i) => {
                            return (
                              <Link href={`/services/${item.slug.current}`} key={i}>
                                <a className={`transition-opacity ease-in-out duration-300 hover:opacity-60 focus:opacity-60 ${i !== services.length && 'mr-[6px] underline'}`}>
                                  {item.title}{i !== services.length - 1 && (',')}
                                </a>
                              </Link>
                            )
                          })}
                          </p>
                        </div>
                      )}

                      {/* {about && (
                        <div className="mb-5 md:mb-8">
                          <span className="block font-bold text-lg md:text-xl xl:text-2xl mb-1">About:</span>

                          <p className="block max-w-lg">{about}</p>
                        </div>
                      )} */}

                      <div className="mt-16 md:mt-[10vw] 2xl:mt-32">
                        <ScrollToContent blue />
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">

                  </div>
                </div>
              </Container>
            </motion.div>
          </motion.section>

          <motion.section
            initial="initial"
            animate="enter"
            exit="exit"
            className="bg-white bg-noise text-blue relative z-[20] pt-2" id="intro-area"
          >
            <motion.div variants={fadeSmallDelay} className="relative z-20">
              <div className="w-full md:w-10/12 lg:w-11/12 max-w-[1200px] mx-auto px-6">
                <div className={`${stats ? 'pt-12 md:pt-24 lg:pt-32 pb-10 md:pb-16 lg:pb-20' : 'py-16 md:py-32 lg:py-40'}`}>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold">{about}</p>
                </div>
              </div>

              {stats && (
                <div className="flex flex-wrap w-full md:w-10/12 lg:w-11/12 max-w-[1200px] mx-auto px-6 pb-12 md:pb-24 lg:pb-32">
                  {stats.map((stat, i) => {
                    return (
                      <div className="w-full md:w-1/2 xl:flex-1 mb-4 md:mb-6 xl:mb-2">
                        <span className="block text-base md:text-lg lg:text-xl">{stat.statHeading}</span>
                        <span className="block font-bold text-lg md:text-xl lg:text-2xl">{stat.statText}</span>
                      </div>
                    )
                  })}
                </div>
              )}
              
              {content && (
                <div className="mb-[12vw]">
                  <GuidesContentWrapper text={content} mini />
                </div>
              )}
            </motion.div>
          </motion.section>
          
          <motion.section
            initial="initial"
            animate="enter"
            exit="exit"
            className="bg-white bg-noise text-blue mt-[-2px] relative z-[20] pt-2">
            {nextCase ? (
              <div className="w-full md:w-11/12 lg:w-11/12 max-w-screen-2xl mx-auto px-6 pb-6">
                <Link href={`/case-studies/${nextCase.slug.current}`}>
                <a className="flex flex-wrap text-current border-t border-current pt-6 pb-4 md:py-12 2xl:py-14 md:-mx-8 group">
                  <div className="w-full md:w-full self-end mb-auto block md:hidden">
                    <span className={`block stroke stroke--thin text-3xl md:text-4xl 2xl:text-5xl font-bold mt-[0px] md:-mt-1 md:w-full pr-2 mb-6`}>Next Project</span>
                  </div>

                  <div className={`flex flex-wrap w-full md:px-8 2xl:px-12`}>
                    <div className="w-full md:w-1/2 lg:px-8 flex flex-wrap order-2 md:order-1 relative">
                      <div className="w-32 md:w-full self-end mb-auto hidden md:block">
                        <span className={`block stroke stroke--thin text-2xl md:text-4xl 2xl:text-5xl font-bold mt-[0px] md:-mt-1 md:w-full pr-2`}>Next Project</span>
                      </div>
          
                      <div className="flex-1 md:w-full mt-[5px] md:mt-0 md:h-full md:flex md:flex-wrap">
                        <div className={`w-full my-auto`}>
                          <div className={`w-11/12 md:w-10/12 `}>
                            { nextCase.title && (
                              <h2 className={`font-display block text-[40px] md:text-[5.2vw] 2xl:text-[80px] leading-none mb-2 md:mb-6 pb-0 max-w-[90%]`}>{nextCase.title}</h2>
                            )}
                          </div>
                        </div>
                        
                        { nextCase.services && (
                          <div className="w-full self-end md:pb-12 2xl:pb-16 mt-5 md:mt-auto">
                            {nextCase.services.map((item, i) => {
                              return (<span key={i} className="block md:block text-[12px] md:text-[15px] 2xl:text-[15px] leading-snug mb-[2px] mr-3 md:mr-0 md:mb-0">{item.title}</span>)
                            })}
                          </div>
                        )}
                      </div>
          
                      <span className="block rounded-full ml-auto ring-white transform hover:scale-125 transition ease-in-out duration-300 absolute bottom-0 right-0 bg-blue md:hidden">
                        <svg className="w-8 transform rotate-90 text-white" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 16.57l-6.188-6.232-6.188 6.231M17.812 10.338V25" stroke="currentColor"/></svg>
                      </span>
                    </div>
                    
                    <div className={`w-full md:w-1/2 lg:px-8 order-1 md:order-2 mb-4 md:mb-0 relative`}>
                      <div className="w-20 lg:w-28 h-20 lg:h-28 opacity-0 transform scale-50 group-hover:opacity-100 group-hover:scale-100 transition ease-in-out duration-500 bg-blue absolute bottom-[30%] md:bottom-[50%] lg:bottom-[30%] xl:bottom-[20%] md:left-[-30px] lg:left-[-10px] z-10 rounded-full items-center justify-center hidden md:flex"><span className="block text-white uppercase font-display text-base lg:text-lg">View</span></div>
                      
                      { nextCase.images && (
                        <>
                          <div className="block md:hidden bg-blue">
                            <ImageWrapper
                              image={nextCase.images[0]}
                              className="w-full will-change"
                              baseWidth={520}
                              baseHeight={520}
                              alt={nextCase.title}
                            />
                          </div>

                          <div className="hidden md:block bg-blue overflow-hidden">
                            <div className="transform ease-in-out duration-500 scale-100 group-hover:scale-105 group-focus:scale-105 will-change">
                              <ImageWrapper
                                image={nextCase.images[0]}
                                className="w-full"
                                baseWidth={720}
                                baseHeight={720}
                                alt={nextCase.title}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </a>
              </Link>
            </div>
            ) : (
              <div className="w-full md:w-11/12 lg:w-11/12 max-w-screen-2xl mx-auto px-6 pb-6">
                <Link href={`/case-studies/${firstCase.slug.current}`}>
                <a className="flex flex-wrap text-current border-t border-current pt-6 pb-4 md:py-12 2xl:py-14 md:-mx-8 group">
                  <div className="w-full md:w-full self-end mb-auto block md:hidden">
                    <span className={`block stroke stroke--thin text-3xl md:text-4xl 2xl:text-5xl font-bold mt-[0px] md:-mt-1 md:w-full pr-2 mb-6`}>Next Project</span>
                  </div>

                  <div className={`flex flex-wrap w-full md:px-8 2xl:px-12`}>
                    <div className="w-full md:w-1/2 lg:px-8 flex flex-wrap order-2 md:order-1 relative">
                      <div className="w-32 md:w-full self-end mb-auto hidden md:block">
                        <span className={`block stroke stroke--thin text-2xl md:text-4xl 2xl:text-5xl font-bold mt-[0px] md:-mt-1 md:w-full pr-2`}>Next Project</span>
                      </div>
          
                      <div className="flex-1 md:w-full mt-[5px] md:mt-0 md:h-full md:flex md:flex-wrap">
                        <div className={`w-full my-auto`}>
                          <div className={`w-11/12 md:w-10/12 `}>
                            { firstCase.title && (
                              <h2 className={`font-display block text-[40px] md:text-[5.2vw] 2xl:text-[80px] leading-none mb-2 md:mb-6 pb-0 max-w-[400px]`}>{firstCase.title}</h2>
                            )}
                          </div>
                        </div>
                        
                        { firstCase.services && (
                          <div className="w-full self-end md:pb-12 2xl:pb-16 mt-5 md:mt-auto">
                            {firstCase.services.map((item, i) => {
                              return (<span key={i} className="block md:block text-[12px] md:text-[15px] 2xl:text-[15px] leading-snug mb-[2px] mr-3 md:mr-0 md:mb-0">{item.title}</span>)
                            })}
                          </div>
                        )}
                      </div>
          
                      <span className="block rounded-full ml-auto ring-white transform hover:scale-125 transition ease-in-out duration-300 absolute bottom-0 right-0 bg-blue md:hidden">
                        <svg className="w-8 transform rotate-90 text-white" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 16.57l-6.188-6.232-6.188 6.231M17.812 10.338V25" stroke="currentColor"/></svg>
                      </span>
                    </div>
                    
                    <div className={`w-full md:w-1/2 lg:px-8 order-1 md:order-2 mb-4 md:mb-0 relative`}>
                      <div className="w-20 lg:w-28 h-20 lg:h-28 opacity-0 transform scale-50 group-hover:opacity-100 group-hover:scale-100 transition ease-in-out duration-500 bg-blue absolute bottom-[30%] md:bottom-[50%] lg:bottom-[30%] xl:bottom-[20%] md:left-[-30px] lg:left-[-10px] z-10 rounded-full items-center justify-center hidden md:flex"><span className="block text-white uppercase font-display text-base lg:text-lg">View</span></div>
                      
                      { firstCase.images && (
                        <>
                          <div className="block md:hidden bg-blue">
                            <ImageWrapper
                              image={firstCase.images[0]}
                              className="w-full will-change"
                              baseWidth={520}
                              baseHeight={520}
                              alt={firstCase.title}
                            />
                          </div>

                          <div className="hidden md:block bg-blue overflow-hidden">
                            <div className="transform ease-in-out duration-500 scale-100 group-hover:scale-105 group-focus:scale-105 will-change">
                              <ImageWrapper
                                image={firstCase.images[0]}
                                className="w-full"
                                baseWidth={720}
                                baseHeight={720}
                                alt={firstCase.title}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </a>
              </Link>
            </div>
            )}
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

export async function getStaticPaths() {
  const paths = await pageService.fetchPaths('caseStudy')
  return {
    paths: paths,
    fallback: false,
  };
}