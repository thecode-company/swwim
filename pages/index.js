import { useCallback, useEffect, useContext, useRef } from 'react';
import Image from 'next/image'
import Layout from '../components/layout'
import Header from '../components/header'
import Footer from '../components/footer'
import Container from '../components/container'
import { fade, fadeDelay, fadeSmallerDelay, revealIn, revealInLogo, revealInLogoMove, textReveal } from "../helpers/transitions"
import Link from 'next/link'
import { motion } from 'framer-motion'
import FancyLink from '../components/fancy-link'
import Accordion from '../components/accordion'
import NewsTeaser from '../components/news-teaser'
import ScrollToContent from '../components/scroll-to-content'
import { NextSeo } from 'next-seo'
import InstaStories from '../components/insta-stories';
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import SanityPageService from '../services/sanityPageService'
import BlockContentWrapper from '../components/block-content-wrapper'
import ImageWrapper from '../helpers/image-wrapper';
import Logo from '../components/logo';
import { SmoothScrollProvider } from '../contexts/SmoothScroll.context'
import LottieAnimation from '../components/lottie-animations'
import ImageStandard from '../helpers/image-standard';
import { PopupContext } from '../contexts/popup'
import ConditionalWrap from 'conditional-wrap';
import { useRouter } from 'next/router';

gsap.registerPlugin(ScrollTrigger);

const query = `{
  "home": *[_type == "home"][0]{
    title,
    seo {
      ...,
      shareGraphic {
        asset->
      }
    },
    heroImage {
      asset->
    },
    heroSupportingImage {
      asset->
    },
    welcomeHeading,
    welcomeText,
    welcomeSectionImages[] {
      asset->
    },
    welcomeSectionInstaStories[] {
      asset->,
      video {
        asset->
      }
    },
    justGettingOnWithItText,
    justGettingOnWithItImage {
      asset ->
    }
  },
  "services": *[_type == "service"] {
    title,
    content,
    slug {
      current
    },
    icon {
      asset->
    }
  },
  "clients": *[_type == "client"] | order(order asc) {
    title,
    externalWebsite,
    internalCaseStudy-> {
      title,
      slug {
        current
      }
    },
    logo {
      asset->
    }
  },
  "news": *[_type == "news"] {
    title,
    slug {
      current
    },
    heroImage {
      asset -> {
        ...
      }
    },
    categories[]-> {
      title
    },
    content,
    author-> {
      firstName,
      image {
        asset -> {
          ...
        }
      },
      imageAuthor {
        asset -> {
          ...
        }
      }
    },
    date
  }[0...3],
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

export default function Home(initialData) {
  const { data: { home, services, clients, news, contact, popup }  } = pageService.getPreviewHook(initialData)()
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

  // function goToContent(event) {
  //   event.preventDefault()
  //   scroll && scroll.scrollTo(500)

  //   setTimeout(() => scroll && scroll.update(), 250);
  // }
  
  
  const revealRefs = useRef(null);
  const wavyTextRefs = useRef(null);
  const svgDrawRefs = useRef(null);

  revealRefs.current = [];
  wavyTextRefs.current = [];
  svgDrawRefs.current = [];

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

  // Wavey Text Reveals
  // useEffect(() => {
  //   wavyTextRefs.current.forEach((el, index) => {
  //     gsap.fromTo(el, {
  //       y: -2
  //     }, {
  //       duration: 1, 
  //       y: 4,
  //       ease: "power2.easeInOut",
  //       scrollTrigger: {
  //         trigger: el,
  //         start: 'top center+=300',
  //         toggleActions: 'play none none reverse'
  //       }
  //     });
  //   });
  // }, []);
  
  // SVG Draw Reveal
  // useEffect(() => {
  //   svgDrawRefs.current.forEach((el, index) => {
  //     gsap.fromTo(el, {
  //       y: -2
  //     }, {
  //       duration: 1, 
  //       y: 4,
  //       ease: "power2.easeInOut",
  //       scrollTrigger: {
  //         trigger: el,
  //         start: 'top center+=300',
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

  const addWavyTextRefs = el => {
    if (el && !wavyTextRefs.current.includes(el)) {
      wavyTextRefs.current.push(el);
    }
  };

  const addSVGDrawRefs = el => {
    if (el && !svgDrawRefs.current.includes(el)) {
      svgDrawRefs.current.push(el);
    }
  };

  return (    
    <Layout>
      <NextSeo
        title={home.seo?.metaTitle ? home.seo.metaTitle : home.title}
        description={home.seo?.metaDesc ? home.seo.metaDesc : null}
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
          description: home.seo?.metaDesc ? home.seo.metaDesc : null,
          images: [
            {
              url: home.seo?.shareGraphic?.asset.url ?? null,
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
        <motion.div variants={revealInLogo} className="absolute inset-0 w-full h-full text-white flex items-center justify-center pointer-events-none z-[110]">
          <div className="overflow-hidden">
            <motion.div variants={revealInLogoMove}>
              <Logo width="w-32 md:w-48 xl:w-56" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div variants={revealIn} className="absolute inset-0 w-full h-full bg-blue-dark text-white overflow-visible">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full text-blue-dark absolute top-0 left-0 right-0 mt-[-20vw] will-change">
          <path fill="currentColor" fillOpacity="1" d="M0,224L48,192C96,160,192,96,288,106.7C384,117,480,203,576,224C672,245,768,203,864,170.7C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        </motion.div>
      </motion.div>


      <div data-scroll-container id="scroll-container">
      <SmoothScrollProvider options={{ smooth: true, lerp: 0.07 }}>

      <Header contact={contact} active="index" />

      <motion.section
        initial="initial"
        animate="enter"
        exit="exit"
        className="bg-blue bg-noise text-white pt-[152px] md:pt-[188px] xl:pt-[188px] 2xl:pt-[188px]" 
      >
        <motion.div variants={fadeDelay} className="relative z-10">

          <Container>
            <div className="mb-3">
              <ScrollToContent />
            </div>

            <div className="relative mb-8 md:mb-6 2xl:mb-8">
              <div className="w-[30%] md:w-[20%] absolute top-0 left-0 mt-[6%] ml-[65%] md:mt-[10%] md:ml-[46%] z-20 animate--wiggle">
                <motion.div variants={fade}>
                  <ImageStandard height={242} width={250} src="/icons/megaphone.svg" alt="Megaphone Icon" layout="responsive" priority />
                </motion.div>
              </div>

              <div className="hidden md:block md:w-[27%] lg:w-[27%] 2xl:w-[23%] md:h-[7.9vw] lg:h-[8vw] 2xl:h-[24%] md:mb-[1.75vw] 2xl:mb-8 absolute bottom-0 left-0 z-10 bg-blue-dark bg-opacity-50 overflow-hidden">
                {/* <ImageStandard src="https://placedog.net/500/280" alt="Placeholder Dog" layout="fill" className="absolute inset-0 w-full h-full object-cover object-center" priority /> */}
                <div className="absolute inset-0 w-full h-full" data-scroll data-scroll-speed={0.25}>
                  <motion.div className="w-full h-full" variants={fadeSmallerDelay}>
                    <ImageWrapper
                      image={home.heroImage.asset}
                      className="w-full h-full object-cover object-center transform scale-[1.15]"
                      baseWidth={720}
                      baseHeight={500}
                      fill={true}
                      alt={'Delivering Creative Campaigns That Float'}
                      priority
                    />
                  </motion.div>
                </div>
              </div>

              <div className="hidden md:block md:w-[19vw] lg:w-[21%] 2xl:w-[17%] md:h-[7.3vw] lg:h-[7.5vw] 2xl:h-[10.8vw] absolute top-0 right-0 z-10 bg-blue-dark bg-opacity-50 overflow-hidden hero-top-right md:mt-[8px] lg:mt-[11px] 2xl:mt-[15px]">
                {/* <ImageStandard src="https://placedog.net/500/280" alt="Placeholder Dog" layout="fill" className="absolute inset-0 w-full h-full object-cover object-center" priority /> */}
                <div className="absolute inset-0 w-full h-full">
                  <motion.div className="w-full h-full" variants={fadeSmallerDelay}>
                    <ImageWrapper
                      image={home.heroSupportingImage.asset}
                      className="w-full h-full object-cover object-center transform scale-[1.15]"
                      baseWidth={704}
                      baseHeight={230}
                      fill={true}
                      alt={'Delivering Creative Campaigns That Float'}
                      priority
                    />
                  </motion.div>
                </div>
              </div>
              
              <div className="overflow-hidden">
                <motion.span variants={textReveal} className="block font-display uppercase text-[13.6vw] md:text-[10.5vw] 2xl:text-[170px] leading-none relative z-10">Social Media</motion.span>
              </div>
              
              <div className="overflow-hidden">
                <motion.span variants={textReveal} className="block font-display uppercase text-[13.6vw] md:text-[10.5vw] 2xl:text-[170px] leading-none relative z-10">Marketing</motion.span>
              </div>

              {/* <div className="overflow-hidden">
                <motion.span variants={textReveal} className="block md:text-right font-display uppercase text-[13.6vw] md:text-[10.5vw] 2xl:text-[170px] leading-none relative z-10">Marketing</motion.span>
              </div> */}
              
              <div className="overflow-hidden">
                <motion.span variants={textReveal} className="block md:text-right font-display uppercase text-[13.6vw] md:text-[10.5vw] 2xl:text-[170px] leading-none relative z-10">That Floats</motion.span>
              </div>

              {/* <motion.div variants={fadeDelay} className="w-1/2 md:w-4/12 absolute top-0 right-0 mt-[32vw] mr-[4vw] md:mr-0 md:mt-[28vw] 2xl:mt-[32%] z-0">
                <LottieTest/>
              </motion.div> */}


              <svg className="w-1/2 md:w-4/12 absolute top-0 right-0 mt-[35vw] mr-[4vw] md:mr-0 md:mt-[17.5vw] 2xl:mt-[19%] z-0" viewBox="0 0 447 258" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity=".447"><mask id="mask-a" maskUnits="userSpaceOnUse" x="0" y="0" width="447" height="258"><path fillRule="evenodd" clipRule="evenodd" d="M0 0h447v258H0V0z" fill="#fff"/></mask><g mask="url(#mask-a)"><path fillRule="evenodd" clipRule="evenodd" d="M53.828 230.687c-10.89-6.159-20.862-14.418-28.037-24.655-7.078-10.098-11.515-22.131-12.372-34.027a73.814 73.814 0 01-.172-5.233c9.767 16.713 23.923 31.084 39.348 42.517 24.188 17.925 53.103 29.06 82.627 34.699 3.62.69 7.25 1.3 10.891 1.849-1.72.121-3.441.232-5.166.321-29.476 1.522-60.958-.681-87.12-15.471zm-38.8-130.357c8.148-23.03 29.039-40.3 50.082-52.253 26.129-14.84 55.343-24.157 84.81-29.832 30.327-5.84 61.61-8.004 92.464-6.43 28.104 1.435 56.265 6.358 82.558 16.506 18.94 7.308 39.338 18.807 49.708 36.502 2.744 4.677 4.25 8.368 5.542 13.817 1.383 5.82 1.63 11.91.998 18.431-1.378 14.208-7.725 27.581-15.776 39.23-15.112 21.862-35.783 39.678-58.002 54.179-23.274 15.193-48.672 27.354-74.877 36.695-11.839 4.219-23.909 7.839-36.142 10.782-2.137.004-4.274.027-6.412-.003-31.201-.445-62.576-4.828-91.691-16.335-25.07-9.908-48.21-25.476-65.286-46.312-7.17-8.746-13.125-18.779-16.934-29.416 3.937-14.63 11.717-28.368 21.676-39.878 17.88-20.659 42.67-33.85 68.918-41.476 30.031-8.724 61.589-10.138 92.695-8.841 16.243.678 32.443 2.126 48.609 3.817 3.082.323 5.725-2.836 5.725-5.672 0-3.334-2.636-5.348-5.725-5.671-34.274-3.582-68.954-6.115-103.336-2.416-30.385 3.269-60.75 11.556-86.644 28.061-19.82 12.636-36.243 30.36-46.323 51.436-.536-8.297.453-16.694 3.363-24.921zm431.207 63.482c-1.465-2.48-5.29-3.8-7.835-2.034a429.465 429.465 0 01-77.083 42.449c-26.732 11.329-54.754 19.834-83.242 25.549a423.547 423.547 0 01-34.641 5.446 404.608 404.608 0 0033.575-14.547c25.653-12.51 50.162-27.985 71.071-47.409 21.628-20.095 41.423-45.688 44.52-75.785 1.307-12.71-1.046-25.588-7.191-36.847-5.545-10.158-13.889-18.415-23.165-25.264-19.627-14.492-44.136-22.736-67.791-28.016C262.398.201 229.157-1.277 196.445.967c-31.951 2.19-63.885 7.67-94.157 18.2C74.9 28.695 47.45 41.937 26.751 62.543 17.217 72.03 9.38 83.129 4.585 95.687c-5.194 13.611-5.805 28.477-2.692 42.638.61 2.789 1.395 5.52 2.26 8.22-5.062 22.418-1.606 46.334 11.959 65.51 17.163 24.263 45.16 37.95 74.085 42.916 32.283 5.541 66.037 2.964 97.969-3.56 3.065-.625 6.115-1.329 9.159-2.039 11.665-.057 23.323-.637 34.901-1.649 30.533-2.667 60.794-8.471 90.096-17.384 29.268-8.904 57.66-20.834 84.426-35.562a427.403 427.403 0 0037.434-23.205c2.528-1.754 3.704-4.962 2.053-7.76z" fill="#01295F"/></g></g></svg>

              <span className="relative md:absolute z-10 top-0 right-0 block text-lg md:text-[1.6vw] lg:text-[1.4vw] 2xl:text-[19px] w-10/12 md:w-[33%] 2xl:w-[30%] leading-tight 2xl:leading-snug font-medium mt-2 md:mt-[11vw] lg:mt-[13vw] 2xl:mt-[14.3%]">
                <span className="2xl:max-w-md block ">
                  Collaborating with content specialists, influencers and all-round creative types, to make communicating your brand a balmy breeze.
                </span>
              </span>
            </div>

            <div className="block w-full md:w-[31vw] lg:w-[32vw] 2xl:w-[30%] md:h-[18.5vw] 2xl:h-[44%] md:mb-[1.75vw] 2xl:mb-7 z-10 bg-blue-dark bg-opacity-50 overflow-hidden md:hidden">
              {/* <ImageStandard src="https://placedog.net/500/280" alt="Placeholder Dog" layout="fill" className="absolute inset-0 w-full h-full object-cover object-center" priority /> */}
              <div className="">
                <motion.div className="w-full" variants={fadeSmallerDelay}>
                  <ImageWrapper
                    image={home.heroImage.asset}
                    className="w-full"
                    baseWidth={720}
                    baseHeight={500}
                    alt={'Delivering Creative Campaigns That Float'}
                    priority
                  />
                </motion.div>
              </div>
            </div>



            <div className="border-t border-b border-white py-4 md:py-6 relative z-10 overflow-hidden mt-5 md:mt-0">
              <div className="overflow-hidden">
                <motion.div variants={textReveal}>
                  <div className="relative flex overflow-x-hidden font-display uppercase md:text-[2vw] 2xl:text-3xl">  
                    <div className="animate-marquee whitespace-nowrap">
                      <span className="mx-1">Brand Strategy</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Events</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Influencer Marketing</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Content Creation</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Copywriting</span>
                      <span className="mx-1">&bull;</span>
                    </div>

                    <div className="absolute top-0 animate-marquee2 whitespace-nowrap">
                      <span className="mx-1">Brand Strategy</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Events</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Influencer Marketing</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Content Creation</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Copywriting</span>
                      <span className="mx-1">&bull;</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </Container>
          
          <Container overflowHidden>
            <div className="relative mb-16 md:mb-32 2xl:mb-40 pt-20 md:pt-24 2xl:pt-32" id="intro-area">
              <div className="w-[38%] md:w-[40%] absolute top-auto md:top-0 bottom-0 z-20 md:bottom-auto right-0 mb-28 md:mb-0 md:mt-[25%] max-w-xs -mr-16 md:-mr-28 2xl:-mr-6 hidden md:block animate--float" ref={fadeRevealRefs}>
                <ImageStandard width={279} height={418} layout="responsive" src="/icons/rubber-ring.svg" alt="Unicorn Illustration" className="w-full will-change" />
              </div>

              <div className="hidden md:block md:w-[14%] absolute top-auto md:top-0 bottom-0 z-20 md:bottom-auto left-0 mb-28 md:mb-0 md:mt-[50%] 2xl:mt-[42%] max-w-[170px] -ml-16 md:ml-[-8%] 2xl:ml-20 animate--float animate--stagger" ref={fadeRevealRefs}>
                <ImageStandard width={151} height={230} layout="responsive" src="/icons/bottle-right.svg" alt="Bottle Illustration" className="w-full will-change" />
              </div>
              
              <div className="md:mx-12 2xl:mx-16">
                <div className="flex flex-wrap md:-mx-6">
                  <div className="w-full md:w-7/12 xl:w-1/2 md:px-6 mb-12 md:mb-0">
                    <div className="max-w-xl">
                      <div className="inline-block mb-2 md:mb-4">
                      <span className="text-base md:text-lg font-display uppercase mb-2 md:mb-3 flex">
                        <span className="block transform animate--letter-float--delay">W</span>
                        <span className="block transform animate--letter-float" ref={addWavyTextRefs}>e</span>
                        <span className="block transform animate--letter-float--delay">l</span>
                        <span className="block transform animate--letter-float" ref={addWavyTextRefs}>c</span>
                        <span className="block transform animate--letter-float--delay">o</span>
                        <span className="block transform animate--letter-float" ref={addWavyTextRefs}>m</span>
                        <span className="block transform animate--letter-float--delay">e</span>
                      </span>

                        <div className="relative">
                          <h1 className="font-display uppercase block text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl mb-0 pb-0 pr-12 md:pr-10 lg:pr-32 2xl:pr-12 relative z-10">{home.welcomeHeading}</h1>

                          <div className="absolute top-0 left-0 bottom-0 right-0 w-9/12 z-0  home-squiggle">
                            {/* <LottieTest/> */}
                            {/* <svg className="w-full" viewBox="0 0 531 66" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M195.428.048c-29.893 2.527-59.819 5.47-88.75 10.611-29.055 5.162-56.873 12.63-80.897 23.52-5.988 2.715-12.078 5.588-17.146 8.888-5.444 3.544-9.877 7.977-8.32 12.886 2.636 8.293 19.525 10.11 31.641 10.045 32.537-.177 64.717-3.95 95.709-9.515 30.517-5.48 60.043-12.605 89.734-19.4 15.079-3.45 30.215-6.822 45.556-9.865 6.587-1.307 13.311-2.856 20.123-3.71a58.428 58.428 0 012.531-.258c-1.069.088.145-.003.566-.028a106.957 106.957 0 018.102-.148c1.052.022 2.105.058 3.153.113.197.01 1.71.109 1.195.07-.468-.036.858.08 1.126.108.988.104 1.968.23 2.932.392.381.064.758.137 1.134.21.182.034.358.077.536.115.638.136-1.05-.346-.078-.008.665.23 1.825.742.939.291.365.186.755.223.252.115-.266-.055-.34-.274-.102-.048.475.456-.29-.523-.167-.232.238.566-.062-.402-.043-.192.003.03.212-.687-.018-.048-.169.464.496-.427-.012.013-.191.165-.946.833-.36.394-2.739 2.056-5.806 2.998-9.905 4.169-4.296 1.23-8.708 2.319-12.935 3.633-8.683 2.7-17.992 6.965-16.594 13.35.945 4.308 5.725 7.488 12.611 9.071 7.071 1.625 15.623 1.088 22.848.1 15.184-2.078 28.387-7.273 43.307-9.795a561.98 561.98 0 0151.144-6.242c17.54-1.33 35.229-1.868 52.907-1.499 17.764.371 35.577 1.338 53.341.455 8.77-.437 17.47-1.294 25.892-2.792 6.357-1.129 3.646-6.93-2.754-5.792-16.557 2.943-33.798 3.16-50.972 2.792-17.328-.37-34.559-1.084-51.907-.569-17.511.52-34.98 1.83-52.168 3.838a566.073 566.073 0 00-25.015 3.484c-7.497 1.216-14.597 2.864-21.682 4.731-6.945 1.83-13.845 3.76-21.178 5.027-6.208 1.073-14.009 2.043-20.291.629-2.253-.507-4.308-1.42-5.211-2.726-.199-.289-.339-.6-.468-.902-.078-.18-.247-1.028-.183-.49-.033-.272-.029-.544-.031-.817 0-.047.046-.495-.016-.126-.067.41.094-.285.132-.368.11-.248.234-.492.374-.736.299-.526-.299.26.188-.219.265-.261.529-.521.805-.78.119-.11.256-.218.39-.323-.311.242-.231.163.056-.02a25.57 25.57 0 012.21-1.282c.19-.095 1.039-.506.83-.41-.386.176.28-.12.289-.124.35-.147.704-.292 1.062-.435 7.416-2.934 16.34-4.31 23.707-7.249 3.91-1.559 8.47-3.76 9.66-6.567 1.101-2.6-1.154-4.926-4.961-6.262-3.659-1.282-8.168-1.668-12.339-1.914-4.181-.246-8.439-.22-12.61.063-5.617.381-10.822 1.42-16.19 2.43a1059.907 1059.907 0 00-22.382 4.486c-29.549 6.237-58.46 13.434-87.943 19.77-29.306 6.3-59.322 11.738-90.316 14.383a463.74 463.74 0 01-23.245 1.38c-6.928.241-14.261.59-21.113.05-2.58-.203-5.47-.593-7.69-1.188-2.285-.612-4.024-1.33-5.141-2.504-3.12-3.273 1.939-7.115 5.867-9.508 10.074-6.135 22.375-11.252 34.839-15.616 12.363-4.33 25.465-7.92 38.978-10.864 27.652-6.024 56.699-9.58 85.784-12.339 7.135-.677 14.283-1.304 21.437-1.91 2.771-.233 4.294-2.269 3.617-3.693-.816-1.724-3.591-2.333-6.371-2.099z" fill="#01295F" /></svg> */}

                            <div className="block">
                            <svg className="w-full block" viewBox="0 0 377 124" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath=""><path d="M10.501 91.44c-2.291-.208-4.168-.739-5.62-1.712-2.003-1.263-3.347-3.428-3.884-6-.567-3.297.16-7.078 2.48-11.435 10.95-21.005 56.017-55.266 81.658-62.078 1.868-.432 3.574.924 3.846 3.233.272 2.308-.887 4.487-2.755 4.919C64.83 24 19.659 56.21 9.146 76.652c-1.64 3.218-1.567 4.546-1.493 4.793-.011.12.052.486.603.776 9.178 6 56.474-15.679 87.697-29.919 13.96-6.428 27.209-12.44 37.092-16.352 14.066-5.457 19.201-5.834 21.103-1.334 2.791 6.383-3.479 12.907-11.342 21.09-4.038 4.2-12.433 12.936-12.258 16.318.614.656 3.932 2.279 19.595-.63 11.938-2.163 27.911-6.366 46.346-11.187C246.965 46.99 316.268 28.867 373.06 33.05c1.814.164 3.179 2.091 2.963 4.476-.205 2.265-1.81 4.042-3.719 3.87-55.933-4.105-124.737 13.822-174.916 26.946-50.571 13.209-71.234 18.188-73.602 6.074-1.557-8.314 6.307-16.497 14.595-25.122 2.657-2.764 6.482-6.744 8.354-9.34-7.821 1.335-30.317 11.678-48.79 20.102C56.764 79.043 25.298 92.78 10.501 91.439Z" fill="#0D428B"/></g><defs><clipPath id="a"><path fill="#fff" transform="rotate(5.176 4.098 90.67)" d="M0 0h369.808v90.859H0z"/></clipPath></defs></svg>
                            </div>
                          </div>

                          <div className="text-lg opacity-70 mb-4 md:mb-6 content content--dark mt-10">
                        <BlockContentWrapper text={home.welcomeText} />
                      </div>

                      <div className="relative z-20">
                        <FancyLink href="/about" />
                      </div>
                        </div>
                        
                      </div>
                      

                      <div className="w-8/12 max-w-md mx-auto mt-0 md:mt-24 xl:mt-32 hidden md:block bg-blue-dark overflow-hidden" ref={fadeRevealRefs}>
                        <div data-scroll data-scroll-speed={0.45}>
                          { home.welcomeSectionImages[2].asset && (
                            <ImageWrapper
                              image={home.welcomeSectionImages[2].asset}
                              className="w-full will-change transform scale-[1.15]"
                              baseWidth={600}
                              baseHeight={650}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-5/12 xl:w-1/2 md:px-6 ml-auto">
                    <div className="flex flex-wrap -mx-4 md:mx-0">
                      <div className="w-1/2 md:w-full px-4 md:px-0">
                        { home.welcomeSectionImages[0].asset && (
                          <div className="w-full max-w-[400px] ml-auto bg-blue-dark overflow-hidden" ref={fadeRevealRefs}>
                            <div data-scroll data-scroll-speed={0.45}>
                              <ImageWrapper
                                image={home.welcomeSectionImages[0].asset}
                                className="w-full will-change transform scale-[1.15]"
                                baseWidth={540}
                                baseHeight={650}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="w-1/2 md:w-full px-4 md:px-0 mt-16 md:mt-24 lg:mt-32 xl:mt-40 relative">
                        { home.welcomeSectionImages[1].asset && (
                          <div className="w-full max-w-[380px] mr-auto bg-blue-dark overflow-hidden" ref={fadeRevealRefs}>
                            <div>
                              <ImageWrapper
                                image={home.welcomeSectionImages[1].asset}
                                className="w-full will-change "
                                baseWidth={550}
                                baseHeight={720}
                              />
                            </div>
                          </div>
                        )}
                        <InstaStories stories={home.welcomeSectionInstaStories}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>

          <div className="relative pb-[60vw] md:pb-[280px] 2xl:pb-[320px]">

            <div className="w-[90vw] md:w-[70vw] xl:w-[70vw] absolute bottom-0 left-0 z-50 max-w-[1200px]">
              <div className="" ref={fadeRevealRefs}>
              {/* <ImageStandard width={1059} height={526} layout="responsive" src="/icons/sit-back.svg" alt="placeholder" className="w-full" /> */}
              <LottieAnimation />
              </div>
            </div>

            <div className="w-[400px] md:w-[65vw] xl:w-[70vw] absolute bottom-0 left-0 z-20 max-w-[900px] md:-ml-8">
              <div className="" ref={fadeRevealRefs}>
              <ImageStandard width={733} height={955} layout="responsive" src="/icons/the-doing-palm.svg" alt="placeholder" className="w-full" />
              </div>
            </div>

            <div className="w-full bg-white bg-noise bg-noise--white h-24 absolute bottom-0 left-0 right-0 z-30 pb-0 index-layer" data-scroll data-scroll-speed={0.16}>
            </div>

            <Container>
              <div className="flex flex-wrap pb-3 md:pb-16 2xl:pb-24">
                <div className="w-full md:ml-auto">
                  <div className="relative z-40">
                    <h2 className="relative z-10 font-display uppercase text-[13vw] md:text-[10.5vw] 2xl:text-[160px] leading-none md:text-right hidden md:block">
                      <span className="block overflow-hidden">
                        <motion.span variants={textReveal} className="block">We're all about</motion.span>
                      </span>
                      <span className="block overflow-hidden">
                        <motion.span variants={textReveal} className="block"> <span className="stroke">The Graft</span></motion.span>
                      </span>
                    </h2>

                    <h2 className="relative z-10 block md:hidden font-display uppercase text-[13vw] md:text-[10.5vw] 2xl:text-[170px] leading-none md:text-right">We're all about <span className="stroke">the graft</span></h2>

                    {/* <div className="w-5/12 md:w-4/12 absolute bottom-0 right-0 mr-[73%] md:mr-[49%] 2xl:mr-[53%] -mb-2 xl:-mb-5 z-0" ref={fadeRevealRefs}>
                      <ImageStandard width={417} height={220} layout="responsive" src="/icons/circle-squiggle.svg" alt="Circle Illustration" className="w-full will-change" />
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap relative z-50">

                <div className="w-full md:w-5/12 md:ml-auto">
                  <div className="w-11/12">

                    <div className="content content--opaque content--fancy text-lg 2xl:text-xl">
                      <BlockContentWrapper text={home.justGettingOnWithItText} />
                    </div>

                    {/* <h3 className="text-lg md:text-xl 2xl:text-2xl font-bold">Aenean lacinia bibendum nulla sed consectetur. Cras justo odio, dapibus ac facilisis in. Lorem ipsum dolor sit amet consect.</h3>

                    <p className="text-lg opacity-70 mb-4 md:mb-6">Aenean lacinia bibendum nulla sed consectetur. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Etiam porta sem malesuada magna mollis euismod. Morbi leo risus.</p> */}

                    <FancyLink href="/case-studies" label="Case Studies" />
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        initial="initial"
        animate="enter"
        exit="exit"
        className="bg-white bg-noise bg-noise--white text-blue py-10 md:py-16 2xl:py-20 overflow-hidden relative z-10"
      >
        <Container>
          <motion.div variants={fadeDelay} className="relative z-10 pt-10 md:pt-16 2xl:pt-20">
            <Container>

              <div className="flex flex-wrap items-center mb-3 md:mb-5 relative z-10">
                <div className="w-auto">
                  <span className="text-base font-display uppercase mb-1 md:mb-2 flex">
                    <span className="block mx-px animate--letter-float animate--letter-float--delay">N</span>
                    <span className="block mx-px animate--letter-float">e</span>
                    <span className="block mx-px animate--letter-float animate--letter-float--delay">w</span>
                    <span className="block mx-px animate--letter-float">s</span>
                  </span>
                  <h2 className="text-3xl md:text-5xl 2xl:text-6xl font-display uppercase mb-0 pb-0">Latest<span className="block">Poolside</span></h2>
                </div>
                <div className="ml-auto w-auto">
                  <FancyLink href="/news" label="View all news" />
                </div>
              </div>
              
              {news.map((article, i) => {
                return (
                  <NewsTeaser
                    key={i}
                    image={article.heroImage.asset}
                    href={`/news/${article.slug.current}`}
                    ref={fadeRevealRefs}
                    theme="blue"
                    heading={article.title}
                    category={article.categories ? article.categories[0].title : null}
                    date={article.date ?? null}
                    author={article.author ?? null}
                    noBorder={i === news.length - 1}
                    content={article.content}
                  />
                )
              })}
            </Container>
          </motion.div>
        </Container>

        <motion.div variants={fadeDelay} className="relative z-10">
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