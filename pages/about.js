import { useContext, useEffect, useRef } from 'react'
import Image from 'next/image'
import Layout from '../components/layout'
import Footer from '../components/footer'
import Header from '../components/header'
import Container from '../components/container'
import { fade, fadeSmallDelay, revealInNoDelay, revealInLogoNoDelay, revealInLogoMoveNoDelay, textRevealSmallDelay } from "../helpers/transitions"
import { motion } from 'framer-motion'
import AboutCarousel from '../components/about-carousel'
import { NextSeo } from 'next-seo';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import SanityPageService from '../services/sanityPageService'
import Logo from '../components/logo'
import ImageWrapper from '../helpers/image-wrapper'
import { SmoothScrollProvider } from '../contexts/SmoothScroll.context'
import ConditionalWrap from 'conditional-wrap';
import ImageStandard from '../helpers/image-standard'
import { PopupContext } from '../contexts/popup'
import { getRelevantSignupForm } from '../components/signupForm';
import { useRouter } from 'next/router';
import { getRobotsFromSeo, SchemaJsonLd } from '../helpers/seo-utils'

gsap.registerPlugin(ScrollTrigger);

const query = `{
  "about": *[_type == "about"][0] {
    _id,
    seo {
      ...,
      shareGraphic {
        asset->
      }
    },
    title,
    headingLine1,
    headingLine2,
    headingLine3,
    introText,
    values,
    teamSectionHeading,
    instagramSectionHeading,
    heroImageCarousell[] {
      asset->,
      video {
        asset->
      }
    },
    inPageImage {
      asset->
    },
    instagramImages[] {
      asset->,
      instagramImageUrl
    },
  },
  "team": *[_type == "team"] | order(order asc) {
    firstName,
    secondName,
    jobTitle,
    imageAuthor {
      asset->
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

export default function About(initialData) {
  const { data: { about, team, contact, popup, signupForms }  } = pageService.getPreviewHook(initialData)()
  const [popupContext, setPopupContext] = useContext(PopupContext);
  const router = useRouter();
  const canonicalUrl = `https://www.weswwim.com${router.asPath}`;

  useEffect(() => {
    const relevantForm = getRelevantSignupForm(signupForms, 'about', about._id);
    setPopupContext([{
      popupEnabled: popup.popupEnabled,
      title: popup.popupTitle,
      text: popup.popupText,
      newsletter: popup.popupNewsletter,
      article: popup.popupArticle,
      articleLink: popup.popupArticleLink,
      image: popup.popupImage,
      signupForm: relevantForm
    }])
  }, [signupForms, popup, about._id])

  const revealRefs = useRef(null);

  revealRefs.current = [];

  // useEffect(() => {
  //   revealRefs.current.forEach((el, index) => {
  //     gsap.fromTo(el, {
  //       autoAlpha: 0
  //     }, {
  //       duration: 0.35, 
  //       autoAlpha: 1,
  //       ease: "power2.easeInOut",
  //       scrollTrigger: {
  //         trigger: el,
  //         start: 'top center+=400',
  //         toggleActions: 'play none none reverse'
  //       }
  //     });
  //   });
  // }, []);

  const fadeRevealRefs = el => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  const concatenateHeading = (line1, line2, line3) => {
    return [line1, line2, line3].filter(Boolean).join(' ');
  };

  // Create schema data for about page
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Swwim',
    description: about.introText || 'We specialise in influencer marketing, social media, content creation and copywriting. Our experience spans lifestyle, health and beauty and home and interiors.',
    url: 'https://www.weswwim.com/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'Swwim',
      url: 'https://www.weswwim.com',
      logo: about.seo?.shareGraphic?.asset.url || 'https://weswwim.com/images/social-share.jpg',
      description: about.introText || 'We specialise in influencer marketing, social media, content creation and copywriting.',
      image: about.heroImageCarousell[0]?.asset.url || 'https://weswwim.com/images/social-share.jpg',
      foundingDate: '2020', // You may want to adjust this
      founders: team?.map(member => ({
        '@type': 'Person',
        name: `${member.firstName} ${member.secondName}`,
        jobTitle: member.jobTitle,
      })) || [],
    }
  };

  return (
    <Layout>
      <NextSeo
        title={about.seo?.metaTitle ? about.seo.metaTitle : about.title}
        description={about.seo?.metaDesc ? about.seo.metaDesc : null}
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
          description: about.seo?.metaDesc ? about.seo.metaDesc : null,
          images: [
            {
              url: about.seo?.shareGraphic?.asset.url ?? null,
              width: 1200,
              height: 630
            },
          ]
        }}
      />

      {/* Add Schema.org data */}
      <SchemaJsonLd schemas={[aboutPageSchema]} />

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

      <Header contact={contact} active="about" />

      <motion.section
        initial="initial"
        animate="enter"
        exit="exit"
        className="bg-blue bg-noise text-white overflow-hidden pt-[160px] md:pt-[190px]"
      >
        <motion.div variants={fadeSmallDelay} className="relative z-10">
          <Container>
            <div className="relative mb-16 md:mb-20 2xl:mb-28 mx-[3%] md:mx-[5%] lg:mx-24 2xl:mx-32">
              <div className="block overflow-hidden mb-4 md:mb-6 2xl:mb-8">
                <motion.div variants={textRevealSmallDelay} className="block">
                  <span className="text-xl md:text-2xl 2xl:text-3xl font-display uppercase flex justify-center">
                    <span className="block mx-px animate--letter-float--delay">A</span>
                    <span className="block mx-px animate--letter-float">b</span>
                    <span className="block mx-px animate--letter-float--delay">o</span>
                    <span className="block mx-px animate--letter-float">u</span>
                    <span className="block mx-px animate--letter-float--delay">t</span>
                  </span>
                </motion.div>
              </div>

              <div className="relative">
                <h1 className="font-display uppercase text-[9.7vw] md:text-[6.45vw] lg:text-[5.75vw] 2xl:text-[80px] leading-none relative z-10 text-center block md:hidden">{concatenateHeading(about.headingLine1, about.headingLine2, about.headingLine3) || "It's our job to build a community that's right for your brand"}</h1>

                <h1 className="hidden font-display uppercase text-[9.7vw] md:text-[6.45vw] lg:text-[5.75vw] 2xl:text-[80px] leading-none relative z-10 text-center md:block">
                  <span className="block overflow-hidden">
                    <motion.span variants={textRevealSmallDelay} className="block">{about.headingLine1 || "It's our job to build a"}</motion.span>
                  </span>
                  <span className="block overflow-hidden">
                  <motion.span variants={textRevealSmallDelay} className="block">{about.headingLine2 || "community that's"}</motion.span>
                  </span>
                  <span className="block overflow-hidden">
                  <motion.span variants={textRevealSmallDelay} className="block">{about.headingLine3 || "right for your brand"}</motion.span>
                  </span>
                </h1>
                
                <div className="absolute bottom-0 left-0 w-[49%] md:w-[40%] ml-[40%] md:ml-[-2%] lg:ml-[-2%] 2xl:ml-[0%] mb-[10%] md:mb-[-2%] 2xl:mb-[-3%]">
                  <ImageStandard width={369} height={150} layout="responsive" src="/icons/about-hero-swirl.svg" alt="Squiggle Underline" className="w-full will-change" priority />
                </div>
              </div>
            </div>
          </Container>

          <div className="mb-5 md:mb-12 2xl:mb-16">
            <AboutCarousel images={about.heroImageCarousell} />
          </div>

          <Container>
            <div className="relative z-10 overflow-visible pb-24 md:pb-32 lg:pb-36 xl:pb-48 2xl:pb-56">
              <div className="md:mx-[10%] lg:mx-32 xl:mx-40 2xl:mx-56">
                <h2 className="block font-bold text-xl md:text-[2.75vw] 2xl:text-[38px] leading-snug relative mb-5 md:mb-8 2xl:mb-10">{about.introText}</h2>

                <div className="w-full mb-8 md:mb-10 2xl:mb-16">
                  <div className="relative flex overflow-x-hidden">
                    <div className="animate-marquee whitespace-nowrap w-full">
                      <ImageStandard width={935} height={8} layout="responsive" src="/icons/about-underline-squiggle.svg" alt="Squiggle Underline" className="w-full ml-[3px] will-change" />
                    </div>

                    <div className="absolute top-0 animate-marquee2 whitespace-nowrap w-full -ml-5">
                      <ImageStandard width={935} height={8} layout="responsive" src="/icons/about-underline-squiggle.svg" alt="Squiggle Underline" className="w-full will-change" />
                    </div>
                  </div>


                </div>

                <div className="flex flex-wrap md:-mx-6">
                  {about.values?.map((value, i) => {
                    return (
                      <div key={i} className="w-10/12 md:w-1/3 pb-6 md:px-6">
                        <span className="text-lg md:text-xl 2xl:text-2xl font-display uppercase block mb-2 md:mb-4 pb-0">{value.heading}</span>
                        <p className="text-sm leading-relaxed block font-medium opacity-90">{value.text}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="w-[55%] md:w-[35%] lg:w-[30%] 2xl:w-[33%] absolute bottom-0 right-0 mr-[-16%] md:mr-[-10%] lg:mr-[-8%] mb-[-18%] md:mb-[-13%] lg:mb-[-12%] 2xl:mr-[-13%] z-0 transform -rotate-12">
                <div className="animate--wave--slow origin-bottom-left" ref={fadeRevealRefs}>
                  <ImageStandard width={551} height={555} layout="responsive" src="/icons/plant-3.svg" alt="Plant Illustration" className="w-full transform will-change" />
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
        className="bg-white bg-noise bg-noise--white text-blue overflow-hidden"
      >
        <Container>
          <motion.div variants={fadeSmallDelay} className="relative z-10 pt-12 md:pt-24 2xl:pt-28">
            <div className="flex flex-wrap justify-center">
              <div className="inline-block mb-8 md:mb-12 2xl:mb-16 relative z-10 max-w-xs md:max-w-xl 2xl:max-w-2xl mx-auto">
                <span className="text-base font-display uppercase flex mb-1 md:mb-2 justify-center">
                  <span className="block animate--letter-float--delay">T</span>
                  <span className="block animate--letter-float">h</span>
                  <span className="block animate--letter-float--delay">e</span>
                  <span className="block animate--letter-float">&nbsp;</span>
                  <span className="block animate--letter-float--delay">T</span>
                  <span className="block animate--letter-float">e</span>
                  <span className="block animate--letter-float--delay">a</span>
                  <span className="block animate--letter-float">m</span>
                </span>
                <h3 className="text-3xl md:text-5xl 2xl:text-6xl font-display uppercase mb-0 pb-0 text-center">{ about.teamSectionHeading || "Problem solvers with passion" }</h3>
                
                <div className="w-full ml-auto mr-[-8vw] md:mr-[-2vw] 2xl:mr-[-6vw]">
                  <ImageStandard width={268} height={4} layout="responsive" src="/icons/team-stroke.svg" alt="Swipe Underline" className="w-full will-change" />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 mb-16 md:mb-24 2xl:mb-32 relative z-20 md:mx-16 2xl:mx-24">
              {team?.map((person, i) => {
                return (
                  <div className="w-full mb-3 md:mb-5 2xl:mb-8" key={i}>
                    <div className="border-blue border-2 mb-3 md:mb-4 bg-pink h-[50vw] md:h-[27vw] lg:h-[29vw] xl:h-[33vw] 2xl:h-[31.5vw] max-h-[480px] relative team-image">
                      <div className="absolute top-0 left-0 bottom-0 right-0 overflow-hidden">
                        {person.imageAuthor && (
                          <div className="team-image--hover">
                            <ImageStandard
                              src={person.imageAuthor.asset.url}
                              className="w-full will-change"
                              width={400}
                              height={480}
                              layout="responsive"
                              alt={`${person.firstName} ${person.secondName}`}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-lg md:text-xl 2xl:text-2xl font-display block mb-0 pb-0 leading-tight">{person.firstName } { person.secondName }</span>
                    {person.jobTitle && (
                      <span className="text-base font-medium block leading-tight">{person.jobTitle}</span>
                    )}
                  </div>
                )
              })}

              <div className="w-full mb-3 md:mb-5 2xl:mb-8">
                <div className="border-blue border-2 mb-3 md:mb-4 bg-pink h-[50vw] md:h-[27vw] lg:h-[29vw] xl:h-[33vw] 2xl:h-[31.5vw] max-h-[480px] relative team-image">
                  <div className="absolute top-0 left-0 bottom-0 right-0 overflow-hidden">
                    <div className="w-[700%] team-image--hover">
                      <ImageStandard
                        src={'/images/person-fallback.jpg'}
                        className="w-full will-change"
                        layout="responsive"
                        width={5334}
                        height={920}
                        alt="Think you're fit?"
                      />
                    </div>
                  </div>
                </div>

                <span className="text-lg md:text-xl 2xl:text-2xl font-display block mb-0 pb-0 leading-tight">Think you're fit?</span>
                <span className="text-base font-medium block leading-tight">Email us at <a className="underline hover:opacity-60 transition-opacity ease-in-out duration-500" href="mailto:careers@weswwim.com">careers@weswwim.com</a></span>
              </div>
            </div>

            <div className="w-[80%] md:w-[60%] 2xl:w-[50%] absolute top-0 md:bottom-0 left-0 ml-[-28%] md:ml-[-20%] mt-[4%] md:mt-[6%] 2xl:mt-[4%] z-0">
              <div className="animate--wave--slow" ref={fadeRevealRefs}>
                <ImageStandard width={775} height={1092} layout="responsive" src="/icons/palm-tree.svg" alt="Plant Illustration" className="w-full will-change" />
              </div>
            </div>
          </motion.div>
        </Container>

        <motion.div variants={fadeSmallDelay} className="relative z-10">
          <div className="mb-6 md:mb-12 2xl:mb-16 relative z-10 overflow-hidden">
            <div className="relative flex overflow-x-hidden font-display uppercase text-5xl md:text-[5.5vw] xl:text-[4.5vw] 2xl:text-[80px]">
              <div className="animate-marquee whitespace-nowrap">
                <span className="ml-2 mr-3">Building communities with heart &bull;</span>
                <span className="ml-2 mr-3">Building communities with heart &bull;</span>
                <span className="ml-2 mr-3">Building communities with heart &bull;</span>
                <span className="ml-2 mr-3">Building communities with heart &bull;</span>
                <span className="ml-2 mr-3">Building communities with heart &bull;</span>
                <span className="ml-2 mr-3">Building communities with heart &bull;</span>
              </div>

              <div className="absolute top-0 animate-marquee2 whitespace-nowrap">

                <span className="ml-2 mr-3">Building communities with heart &bull;</span>
                <span className="ml-2 mr-3">Building communities with heart &bull;</span>
                <span className="ml-2 mr-3">Building communities with heart &bull;</span>
                <span className="ml-2 mr-3">Building communities with heart &bull;</span>
                <span className="ml-2 mr-3">Building communities with heart &bull;</span>
                <span className="ml-2 mr-3">Building communities with heart &bull;</span>
              </div>
            </div>
          </div>
          
          {about.inPageImage && (
            <div className="w-full bg-blue">
              <div ref={fadeRevealRefs}>
                <ImageWrapper
                  image={about.inPageImage.asset}
                  className="w-full will-change"
                  baseWidth={1200}
                  baseHeight={800}
                />
              </div>
            </div>
          )}

          <div className="w-full relative z-[1000] pb-48">

          <div className="w-[24%] md:w-[20%] absolute top-0 right-0 mr-[-14%] md:mr-[-10%] 2xl:mr-[-9%] mt-[1%] z-0 animate--float" ref={fadeRevealRefs}>
            <ImageStandard width={278} height={276} layout="responsive" src="/icons/plant-2.svg" alt="Plant Illustration" className="w-full will-change" />
          </div>

          <div className="w-[65%] md:w-[40%] 2xl:w-[35%] absolute top-0 left-0 ml-[-32%] md:ml-[-18%] 2xl:ml-[-13%] mt-[5%] md:mt-[0%] xl:mt-[0%] z-0 animate--float" ref={fadeRevealRefs}>
            <ImageStandard width={551} height={555} layout="responsive" src="/icons/plant-3.svg" alt="Plant Illustration" className="w-full transform rotate-90 will-change" />
          </div>
            <Container>
              <div className="relative pt-40 pb-32 md:pb-48 md:pt-56 xl:pb-64 xl:pt-80 z-[1000]">
                {/* Top Left */}
                <div className="w-[22vw] md:w-[15vw] h-[22vw] md:h-[15vw] 2xl:w-[270px] 2xl:h-[270px] absolute z-30 top-0 top-[10%] left-0 bg-pink border-2 border-blue" ref={fadeRevealRefs}>
                  <ConditionalWrap
                    condition={about.instagramImages[0].instagramImageUrl}
                    wrap={children => (
                      <a href={about.instagramImages[0].instagramImageUrl} target="_blank" rel="noopener noreferrer" className="group">
                        {children}

                        <div className="absolute z-40 inset-0 bg-blue bg-opacity-80 flex flex-wrap items-center justify-center opacity-0 transition-opacity ease-in-out duration-500 group-hover:opacity-100">
                          <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FFF" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </div>
                      </a>
                    )}
                  >
                    <ImageWrapper
                      image={about.instagramImages[0].asset}
                      className="w-full h-full"
                      baseWidth={650}
                      baseHeight={650}
                      fill="cover will-change"
                    />
                  </ConditionalWrap>
                </div>

                {/* Bottom Left */}
                <div className="w-[15vw] md:w-[12vw] h-[15vw] md:h-[12vw] 2xl:w-[155px] 2xl:h-[155px] absolute z-30 bottom-0 bottom-[10%] left-[15%] border-2 border-blue bg-pink" ref={fadeRevealRefs}>
                  <ConditionalWrap
                    condition={about.instagramImages[1].instagramImageUrl}
                    wrap={children => (
                      <a href={about.instagramImages[1].instagramImageUrl} target="_blank" rel="noopener noreferrer" className="group">
                      {children}

                      <div className="absolute z-40 inset-0 bg-blue bg-opacity-80 flex flex-wrap items-center justify-center opacity-0 transition-opacity ease-in-out duration-500 group-hover:opacity-100">
                        <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FFF" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      </div>
                      </a>
                    )}
                  >
                    <ImageWrapper
                      image={about.instagramImages[1].asset}
                      className="w-full h-full will-change"
                      baseWidth={650}
                      baseHeight={650}
                      fill="cover"
                    />
                  </ConditionalWrap>
                </div>

                {/* Bottom Right */}
                <div className="w-[22vw] md:w-[15vw] h-[22vw] md:h-[15vw] 2xl:w-[270px] 2xl:h-[270px] absolute z-30 bottom-0 bottom-[10%] right-0 border-2 border-blue bg-pink" ref={fadeRevealRefs}>
                  <ConditionalWrap
                    condition={about.instagramImages[2].instagramImageUrl}
                    wrap={children => (
                      <a href={about.instagramImages[2].instagramImageUrl} target="_blank" rel="noopener noreferrer" className="group">
                        {children}

                        <div className="absolute z-40 inset-0 bg-blue bg-opacity-80 flex flex-wrap items-center justify-center opacity-0 transition-opacity ease-in-out duration-500 group-hover:opacity-100">
                          <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FFF" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </div>
                      </a>
                    )}
                  >
                    <ImageWrapper
                      image={about.instagramImages[2].asset}
                      className="w-full h-full will-change"
                      baseWidth={650}
                      baseHeight={650}
                      fill="cover"
                    />
                  </ConditionalWrap>
                </div>

                {/* Top Right */}
                <div className="w-[16vw] md:w-[14vw] h-[16vw] md:h-[14vw] 2xl:w-[190px] 2xl:h-[190px] absolute z-30 top-0 top-[10%] right-[15%] border-2 border-blue bg-pink" ref={fadeRevealRefs}>
                  <ConditionalWrap
                    condition={about.instagramImages[3].instagramImageUrl}
                    wrap={children => (
                      <a href={about.instagramImages[3].instagramImageUrl} target="_blank" rel="noopener noreferrer"className="group">
                        {children}

                        <div className="absolute z-40 inset-0 bg-blue bg-opacity-80 flex flex-wrap items-center justify-center opacity-0 transition-opacity ease-in-out duration-500 group-hover:opacity-100">
                          <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FFF" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </div>
                      </a>
                    )}
                  >
                    <ImageWrapper
                      image={about.instagramImages[3].asset}
                      className="w-full h-full will-change"
                      baseWidth={650}
                      baseHeight={650}
                      fill="cover"
                    />
                  </ConditionalWrap>
                </div>

                {/* Just keep swimming */}
                <div className="absolute bottom-0 mb-6 left-0 w-[28vw] h-[28vw] ml-[-20vw] lg:-ml-40 flex flex-wrap items-center justify-center max-w-xs max-h-[20rem]">
                  <div className="absolute bottom-0 left-0 w-full animate-spin-slow" ref={fadeRevealRefs}>
                    <ImageStandard width={301} height={304} layout="responsive" src="/icons/just-keep-swimming-dark.svg" alt="Just Keep Swimming" className="w-full will-change" />
                  </div>

                  <div className="w-4/12" ref={fadeRevealRefs}>
                    <ImageStandard width={112} height={96} layout="responsive" src="/icons/camera.svg" alt="Camera Illustration" className="w-full will-change" />
                  </div>
                </div>

                <div className="transform -rotate-2 mb-4 md:mb-6 xl:mb-8">
                  <span className="text-base font-display uppercase flex mb-1 md:mb-2 items-center justify-center">
                    <span className="block text-lg md:text-xl xl:text-2xl transform animate--letter-float--delay">I</span>
                    <span className="block text-lg md:text-xl xl:text-2xl transform mx-px animate--letter-float">n</span>
                    <span className="block text-lg md:text-xl xl:text-2xl transform animate--letter-float--delay">s</span>
                    <span className="block text-lg md:text-xl xl:text-2xl transform mx-px animate--letter-float">t</span>
                    <span className="block text-lg md:text-xl xl:text-2xl transform animate--letter-float--delay">a</span>
                    <span className="block text-lg md:text-xl xl:text-2xl transform mx-px animate--letter-float">g</span>
                    <span className="block text-lg md:text-xl xl:text-2xl transform animate--letter-float--delay">r</span>
                    <span className="block text-lg md:text-xl xl:text-2xl transform mx-px animate--letter-float">a</span>
                    <span className="block text-lg md:text-xl xl:text-2xl transform animate--letter-float--delay">m</span>
                  </span>
                </div>

                <span className="text-center block uppercase text-4xl md:text-5xl xl:text-6xl font-display mb-4 md:mb-6">{ about.instagramSectionHeading || "Soak up the latest" }</span>

                <div className="mx-auto flex justify-center">
                  <a href="https://www.instagram.com/weswwim" target="_blank" rel="noopener noreferrer" className={`rounded-full text-center inline-block font-bold group relative overflow-hidden transition-colors ease-in-out duration-500 bg-blue text-white px-5 md:px-8 py-3 md:py-4 font-display text-lg`}>
                    <span className="block relative z-10">@weswwim</span>
                    <div className="absolute bottom-0 left-0 w-full h-0 bg-blue-dark group-hover:h-full group-focus:h-full transition-all ease-in-out duration-500 z-0"></div>
                  </a>
                </div>

                <div className="flex justify-center">
                  <div className="w-32 md:w-40 -mr-20 md:-mr-24 xl:-mr-32">
                    <ImageStandard width={167} height={102} layout="responsive" src="/icons/dive-in.svg" alt="Dive In in handwritten text" className="w-full will-change" />
                  </div>
                </div>
                

              </div>
            </Container>
            

            <div className="absolute bottom-0 left-0 w-full max-w-[200px] md:max-w-[280px] xl:max-w-[380px] ml-[44vw] md:ml-[50vw] xl:ml-[45vw] md:mb-[0px] xl:mb-[10px] z-50" ref={fadeRevealRefs}>
              <ImageStandard width={360} height={319} layout="responsive" src="/icons/rubber-ring.svg" alt="Flamingo Illustration" className="w-full will-change" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 xl:h-48 bg-blue-dark bg-noise -mb-1 z-10"></div>
          </div>
        </motion.div>

        <motion.div variants={fadeSmallDelay} className="relative z-10">
          <Footer contact={contact} removeInsta />
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