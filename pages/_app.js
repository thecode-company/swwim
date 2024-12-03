import '../styles/main.css'
import Head from 'next/head'
import Script from 'next/script'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import { Context } from '../contexts/state';
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '../components/logo'
import Image from 'next/image'
import SEO from '../helpers/seo';
import LottieTest from '../components/lottie-test'
import {AlertContext} from '../contexts/alert'
import {NewsletterContext} from '../contexts/newsletter'
import {PopupContext} from '../contexts/popup'
import { GTM_ID, pageview } from '../lib/gtag'
import ImageWrapper from '../helpers/image-wrapper'

const getRelevantSignupForm = (signupForms, currentPageType, currentPageId) => {
  // First check for a specific page match
  const specificForm = signupForms?.find(form => 
    form.pageType === 'single' && 
    form.specificPage?._id === currentPageId
  );
  if (specificForm) return specificForm;

  // Then check for page type match
  const typeForm = signupForms?.find(form => 
    form.pageType === currentPageType
  );
  if (typeForm) return typeForm;

  return null;
};

const extractFormAction = (embedCode) => {
  if (!embedCode) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(embedCode, 'text/html');
  const form = doc.querySelector('form');
  return form ? form.getAttribute('action') : '';
};

const extractHiddenFields = (embedCode) => {
  if (!embedCode) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(embedCode, 'text/html');
  const hiddenInputs = Array.from(doc.querySelectorAll('input[type="hidden"]'))
    .map(input => input.outerHTML)
    .join('');
  return hiddenInputs;
};

const extractHoneypotField = (embedCode) => {
  if (!embedCode) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(embedCode, 'text/html');
  const honeypot = doc.querySelector('div[aria-hidden="true"]');
  return honeypot ? honeypot.outerHTML : '';
};

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [alertContext, setAlertContext] = useState(true);
  const [newsletterContext, setNewsletterContext] = useState(false);
  const [popupContext, setPopupContext] = useState([]);

  const newsletterToggle = () => {
    if (newsletterContext) {
      setNewsletterContext(false)
      // document.body.style.overflow = 'unset';
      // document.body.style.height = 'auto';
    } else {
      setNewsletterContext(true)
      // document.body.style.overflow = 'hidden';
      // document.body.style.height = '100%';
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setNewsletterContext(true)
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init('425081434701643') // facebookPixelId
        ReactPixel.pageView()

        router.events.on('routeChangeComplete', () => {
          ReactPixel.pageView()
        })
      })
  }, [router.events])

  const popupNavVariant = {
    initial: { opacity: 0 },
    isOpen: { opacity: 1, transition: { type: "easeInOut", duration: 0.35 }},
    exit: { opacity: 0, transition: { type: "easeInOut", duration: 0.35 }}
  };

  const navSlideVariant = {
    initial: { x: "100%" },
    isOpen: { x: "0%", transition: { type: "easeInOut", duration: 0.35 }},
    exit: { x: "100%", transition: { type: "easeInOut", duration: 0.35 }}
  };

  return (
    <>
      <DefaultSeo {...SEO} />
      
      { pageProps.preview && <><div className={'fixed bottom-0 w-full p-2 bg-red-500 bg-opacity-100 text-white justify-center flex z-50 uppercase font-medium'}>! Preview Mode Enabled - <a className={'px-1 underline'} href={`/api/exit-preview?currentRoute=${router.route}`}>Click Here To Exit</a> !</div></> }

      <div className="grain fixed inset-0 pointer-events-none z-[10000]"></div>
      <AlertContext.Provider value={[alertContext, setAlertContext]}>
        <NewsletterContext.Provider value={[newsletterContext, setNewsletterContext]}>
        <Context.Provider value={[menuIsOpen, setMenuIsOpen]}>
        <PopupContext.Provider value={[popupContext, setPopupContext]}>
          {popupContext[0]?.popupEnabled && (
            <AnimatePresence>
              {newsletterContext && (
                <motion.div 
                initial={{ opacity: 0, transition: { duration: 0.6, ease: [0.83, 0, 0.17, 1] } }}
                animate={{ opacity: 1, transition: { duration: 0.6, ease: [0.83, 0, 0.17, 1] } }}
                exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.83, 0, 0.17, 1] } }}
                className="fixed inset-0 h-screen w-full z-[100] flex flex-wrap items-center justify-center">
                  <button onClick={newsletterToggle} className="fixed inset-0 h-screen w-full bg-blue-dark bg-opacity-75 z-[90]focus:border-none focus:outline-none hover:border-none hover:outline-none" aria-label="close newsletter popup"></button>
                  <div className="w-10/12 md:w-8/12 max-w-[640px] bg-white z-[100]">
                    <div className="relative">
                      <button onClick={newsletterToggle} className="z-20 absolute top-0 right-0 p-3 focus:border-none focus:outline-none hover:border-none hover:outline-none" aria-label="close newsletter popup">
                        <div className="bg-white text-blue rounded-full w-10 h-10 flex items-center justify-center group">
                          <svg className="w-[40%] transform group-hover:rotate-90 transition-transform ease-in-out duration-300" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.305 27.132L26.354 2.084M26.354 27.132L1.306 2.083" stroke="currentColor" strokeWidth="3.24"/></svg>
                        </div>
                      </button>
                      
                      {popupContext[0].image && (
                        <ImageWrapper
                          image={popupContext[0].image}
                          className="w-full will-change"
                          baseWidth={720}
                          baseHeight={250}
                          alt={popupContext[0].title}
                        />
                      )}
                      
                      <div className="text-blue py-6 md:py-10 px-3 md:px-10 flex flex-wrap justify-center">
                        {popupContext[0]?.title && (
                          <h3 className="uppercase font-display text-center text-3xl md:text-4xl lg:text-5xl w-full">{popupContext[0].title}</h3>
                        )}
                        {popupContext[0]?.text && (
                          <p className="w-11/12 md:w-9/12 mx-auto text-center">{popupContext[0].text}</p>
                        )}
                        
                        {popupContext[0]?.newsletter && (
                          <div id="mc_embed_signup" className="w-full mt-9">
                              {popupContext[0]?.signupForm?.embedCode && (
                              <form 
                                action={extractFormAction(popupContext[0].signupForm.embedCode)}
                                method="post" 
                                id="mc-embedded-subscribe-form" 
                                name="mc-embedded-subscribe-form" 
                                className="validate w-full relative" 
                                target="_blank" 
                                onSubmit={newsletterToggle}
                              >
                                <div className="mc-field-group w-full">
                                  <label htmlFor="mce-EMAIL" className="hidden">Email Address <span className="inline">*</span></label>
                                  <input 
                                    type="email" 
                                    placeholder="Email Address" 
                                    name="EMAIL" 
                                    className="required email w-full border border-blue border-opacity-50 rounded-full p-[12px] md:p-[14px] px-6 pr-[130px] pl-5 md:pl-6 md:pr-40 text-blue placeholder-blue placeholder-opacity-50" 
                                    id="mce-EMAIL" 
                                    required 
                                  />
                                </div>

                                <div id="mce-responses">
                                  <div className="hidden" id="mce-error-response"></div>
                                  <div className="hidden" id="mce-success-response"></div>
                                </div>

                                {/* Hidden fields from Mailchimp embed code */}
                                <div dangerouslySetInnerHTML={{ 
                                  __html: extractHiddenFields(popupContext[0].signupForm.embedCode)
                                }} />

                                {/* Honeypot field */}
                                <div dangerouslySetInnerHTML={{ 
                                  __html: extractHoneypotField(popupContext[0].signupForm.embedCode)
                                }} />

                                <button 
                                  type="submit" 
                                  className={`rounded-full text-center font-bold px-8 md:px-[34px] py-[11px] bg-blue text-white ring-blue block group overflow-hidden transition-colors ease-in-out duration-500 z-10 absolute top-0 right-0 mt-1 mr-1 text-sm md:text-base`} 
                                  name="subscribe" 
                                  id="mc-embedded-subscribe"
                                >
                                  <span className="block relative z-10">Sign Up</span>
                                  <div className="absolute bottom-0 left-0 w-full h-0 bg-blue-dark group-hover:h-full group-focus:h-full transition-all ease-in-out duration-500 z-0"></div>
                                </button>
                              </form>
                            )}
                          </div>
                        )}

                        {popupContext[0]?.article && (
                          <div className="w-full mt-9 flex justify-center space-x-6">
                            <Link href={`/${popupContext[0].articleLink._type == 'guides' ? 'downloads' : popupContext[0].articleLink._type}/${popupContext[0].articleLink.slug.current}`}>
                              <a className={`rounded-full text-center font-bold px-6 md:px-6 py-[11px] bg-blue text-white ring-blue block group overflow-hidden transition-colors ease-in-out duration-500 text-sm md:text-base relative`} onClick={newsletterToggle}>
                                <span className="block relative z-10">Tell me more</span>
                                <div className="absolute bottom-0 left-0 w-full h-0 bg-blue-dark group-hover:h-full group-focus:h-full transition-all ease-in-out duration-500 z-0"></div>
                              </a>
                            </Link>

                            <button onClick={newsletterToggle} className="block relative font-bold leading p-0 hover:opacity-60 focus:opacity-60 transition-opacity ease-in-out duration-300">
                              No Thanks

                              <div className="absolute bottom-0 left-0 w-full">
                                <div className={`relative z-10 overflow-hidden py-1`}>
                                  <div className="absolute bottom-0 left-0 w-full group-hover:opacity-60 transition-opacity ease-in-out duration-500">
                                    <div className="relative flex overflow-x-hidden">
                                      <div className="animate-marquee-fast animation whitespace-nowrap">
                                        <svg className="block w-full" viewBox="0 0 78 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M38.553 4.595c-.729.068-1.373-.134-1.806-.572-.455-.462-.591-1.121-.383-1.768.102-.314-.058-.57-.357-.7-2.997-1.298-4.725.07-6.252 1.277-1.06.837-2.06 1.628-3.511 1.763-.732.07-1.374-.134-1.806-.572-.454-.462-.6-1.123-.38-1.768.16-.471-.31-.68-.359-.7-.748-.325-1.419-.482-2.027-.517-1.823-.108-3.082.888-4.228 1.794-1.059.837-2.06 1.628-3.511 1.763-.732.07-1.373-.134-1.805-.572-.455-.462-.6-1.123-.381-1.768.16-.471-.31-.68-.358-.7-2.996-1.297-4.725.07-6.253 1.277-1.06.837-2.059 1.628-3.51 1.763-.386.037-.664.333-.622.663.04.307.343.534.697.534a.847.847 0 00.078-.003c1.911-.18 3.186-1.187 4.31-2.076 1.361-1.075 2.375-1.87 4.19-1.268a2.746 2.746 0 00.775 2.352c.644.654 1.578 1.012 2.607 1.012.115 0 .233-.007.35-.016a.848.848 0 00.078-.004c1.911-.18 3.186-1.187 4.31-2.075 1.358-1.072 2.37-1.865 4.177-1.272a.103.103 0 00.013.005 2.746 2.746 0 00.775 2.35c.645.654 1.578 1.013 2.608 1.013.14 0 .281-.007.424-.02 1.913-.18 3.188-1.187 4.313-2.076 1.359-1.075 2.375-1.87 4.189-1.267a2.745 2.745 0 00.777 2.35c.644.654 1.578 1.013 2.608 1.013.14 0 .28-.006.424-.02.386-.036.664-.333.621-.662-.042-.33-.385-.57-.775-.533z" fill="currentColor" stroke="currentColor" strokeWidth=".72"/><path d="M76.553 4.595c-.729.068-1.373-.134-1.806-.572-.455-.462-.591-1.121-.383-1.768.102-.314-.058-.57-.357-.7-2.997-1.298-4.726.07-6.252 1.277-1.06.837-2.06 1.628-3.511 1.763-.732.07-1.374-.134-1.806-.572-.455-.462-.6-1.123-.38-1.768.16-.471-.31-.68-.359-.7-.748-.325-1.419-.482-2.026-.517-1.824-.108-3.083.888-4.229 1.794-1.059.837-2.06 1.628-3.511 1.763-.731.07-1.373-.134-1.805-.572-.455-.462-.6-1.123-.381-1.768.16-.471-.31-.68-.358-.7-2.995-1.297-4.725.07-6.253 1.277-1.06.837-2.059 1.628-3.51 1.763-.386.037-.664.333-.622.663.04.307.343.534.697.534a.844.844 0 00.078-.003c1.911-.18 3.186-1.187 4.31-2.076 1.361-1.075 2.375-1.87 4.19-1.268a2.746 2.746 0 00.775 2.352c.645.654 1.578 1.012 2.607 1.012.115 0 .233-.007.35-.016a.848.848 0 00.078-.004c1.911-.18 3.186-1.187 4.31-2.075 1.358-1.072 2.37-1.865 4.177-1.272l.013.005a2.746 2.746 0 00.775 2.35c.645.654 1.578 1.013 2.608 1.013.14 0 .281-.007.424-.02 1.913-.18 3.188-1.187 4.313-2.076 1.359-1.075 2.375-1.87 4.189-1.267a2.745 2.745 0 00.777 2.35c.644.654 1.578 1.013 2.608 1.013.14 0 .28-.006.424-.02.386-.036.664-.333.622-.662-.043-.33-.386-.57-.775-.533z" fill="currentColor" stroke="currentColor" strokeWidth=".72"/></svg>
                                      </div>

                                      <div className="absolute top-0 animation animate-marquee2-fast whitespace-nowrap">
                                        <svg className="block w-full -ml-1" viewBox="0 0 78 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M38.553 4.595c-.729.068-1.373-.134-1.806-.572-.455-.462-.591-1.121-.383-1.768.102-.314-.058-.57-.357-.7-2.997-1.298-4.725.07-6.252 1.277-1.06.837-2.06 1.628-3.511 1.763-.732.07-1.374-.134-1.806-.572-.454-.462-.6-1.123-.38-1.768.16-.471-.31-.68-.359-.7-.748-.325-1.419-.482-2.027-.517-1.823-.108-3.082.888-4.228 1.794-1.059.837-2.06 1.628-3.511 1.763-.732.07-1.373-.134-1.805-.572-.455-.462-.6-1.123-.381-1.768.16-.471-.31-.68-.358-.7-2.996-1.297-4.725.07-6.253 1.277-1.06.837-2.059 1.628-3.51 1.763-.386.037-.664.333-.622.663.04.307.343.534.697.534a.847.847 0 00.078-.003c1.911-.18 3.186-1.187 4.31-2.076 1.361-1.075 2.375-1.87 4.19-1.268a2.746 2.746 0 00.775 2.352c.644.654 1.578 1.012 2.607 1.012.115 0 .233-.007.35-.016a.848.848 0 00.078-.004c1.911-.18 3.186-1.187 4.31-2.075 1.358-1.072 2.37-1.865 4.177-1.272a.103.103 0 00.013.005 2.746 2.746 0 00.775 2.35c.645.654 1.578 1.013 2.608 1.013.14 0 .281-.007.424-.02 1.913-.18 3.188-1.187 4.313-2.076 1.359-1.075 2.375-1.87 4.189-1.267a2.745 2.745 0 00.777 2.35c.644.654 1.578 1.013 2.608 1.013.14 0 .28-.006.424-.02.386-.036.664-.333.621-.662-.042-.33-.385-.57-.775-.533z" fill="currentColor" stroke="currentColor" strokeWidth=".72"/><path d="M76.553 4.595c-.729.068-1.373-.134-1.806-.572-.455-.462-.591-1.121-.383-1.768.102-.314-.058-.57-.357-.7-2.997-1.298-4.726.07-6.252 1.277-1.06.837-2.06 1.628-3.511 1.763-.732.07-1.374-.134-1.806-.572-.455-.462-.6-1.123-.38-1.768.16-.471-.31-.68-.359-.7-.748-.325-1.419-.482-2.026-.517-1.824-.108-3.083.888-4.229 1.794-1.059.837-2.06 1.628-3.511 1.763-.731.07-1.373-.134-1.805-.572-.455-.462-.6-1.123-.381-1.768.16-.471-.31-.68-.358-.7-2.995-1.297-4.725.07-6.253 1.277-1.06.837-2.059 1.628-3.51 1.763-.386.037-.664.333-.622.663.04.307.343.534.697.534a.844.844 0 00.078-.003c1.911-.18 3.186-1.187 4.31-2.076 1.361-1.075 2.375-1.87 4.19-1.268a2.746 2.746 0 00.775 2.352c.645.654 1.578 1.012 2.607 1.012.115 0 .233-.007.35-.016a.848.848 0 00.078-.004c1.911-.18 3.186-1.187 4.31-2.075 1.358-1.072 2.37-1.865 4.177-1.272l.013.005a2.746 2.746 0 00.775 2.35c.645.654 1.578 1.013 2.608 1.013.14 0 .281-.007.424-.02 1.913-.18 3.188-1.187 4.313-2.076 1.359-1.075 2.375-1.87 4.189-1.267a2.745 2.745 0 00.777 2.35c.644.654 1.578 1.013 2.608 1.013.14 0 .28-.006.424-.02.386-.036.664-.333.622-.662-.043-.33-.386-.57-.775-.533z" fill="currentColor" stroke="currentColor" strokeWidth=".72"/></svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </button>
                          </div>
                        )}

                        {/* <form className="w-full mt-9 relative">
                          <input type="email" className="w-full border border-blue border-opacity-50 rounded-full p-[12px] md:p-[14px] px-6 pr-[130px] pl-5 md:pl-6 md:pr-40 text-blue placeholder-blue placeholder-opacity-50" placeholder="Email Address"></input>

                          <button type="submit" className={`rounded-full text-center font-bold px-8 md:px-[34px] py-[11px] bg-blue text-white ring-blue block group overflow-hidden transition-colors ease-in-out duration-500 z-10 absolute top-0 right-0 mt-1 mr-1 text-sm md:text-base`}>
                            <span className="block relative z-10">Sign Up</span>
                            <div className="absolute bottom-0 left-0 w-full h-0 bg-blue-dark group-hover:h-full group-focus:h-full transition-all ease-in-out duration-500 z-0"></div>
                          </button>

                        </form> */}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <AnimatePresence>
            {menuIsOpen && (
              <div className="fixed inset-0 w-full h-full z-40">
                <motion.div 
                  initial={"initial"}
                  animate={"isOpen"}
                  exit={"exit"}
                  variants={popupNavVariant}
                  className="fixed inset-0 w-full h-full bg-black bg-opacity-80 z-40"
                ></motion.div>

                <div className="flex flex-wrap h-full relative z-50">
                  <button
                    className="w-1/12 md:w-4/12 lg:w-1/2 h-full focus:border-none focus:outline-none hover:border-none hover:outline-none"
                    onClick={() => setMenuIsOpen(false)}
                    aria-label="Close Menu"
                  >  
                  </button>
                  
                  <motion.div 
                    initial={"initial"}
                    animate={"isOpen"}
                    exit={"exit"}
                    variants={navSlideVariant}
                    className="w-11/12 md:w-8/12 lg:w-1/2 h-full ml-auto"
                  >
                    <div className="pt-8 pb-12 md:pt-12 md:pb-16 2xl:pt-16 2xl:pb-20 px-6 md:px-8 2xl:px-20 bg-blue bg-noise text-white h-full flex flex-wrap">

                      <div className="flex flex-wrap items-center relative z-50 w-full mb-auto pb-8 xl:pb-12 max-w-2xl 2xl:pr-8">
                        <Link href="/">
                          <a onClick={() => setMenuIsOpen(false)} aria-label="Navigate to the home page" className="block py-2 ring-white">
                            <Logo width="w-24 md:w-32 2xl:w-40" />
                          </a>
                        </Link>

                        <div className="ml-auto">
                          <div className="flex items-center space-x-1">
                            <Link href="/contact">
                              <a onClick={() => setMenuIsOpen(false)} className={`rounded-full text-center font-bold px-4 md:px-6 py-2 bg-white text-blue hover:text-white ring-blue hidden md:inline-block group relative overflow-hidden transition-colors ease-in-out duration-500`}>
                                <span className="block relative z-10">Contact Us</span>
                                <div className="absolute bottom-0 left-0 w-full h-0 bg-black group-hover:h-full group-focus:h-full transition-all ease-in-out duration-500 z-0"></div>
                              </a>
                            </Link>

                            <button
                              onClick={() => setMenuIsOpen(false)}
                              className="rounded-full text-center block font-bold px-4 md:px-4 py-2 bg-transparent text-white ring-blue group"
                              aria-label="Close Menu"
                            >
                              <div className="flex items-center group-hover:opacity-60 transition-opacity ease-in-out duration-500">
                                <span className="block mr-2">Close</span>
                                <svg className="w-4 transform mt-[3px]" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.305 27.132L26.354 2.084M26.354 27.132L1.306 2.083" stroke="currentColor" strokeWidth="3.24"/></svg>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>

                      <nav className="mb-auto w-full relative z-50 md:pt-[5vh]  open-nav">
                        <ul>
                          <li className="block mb-3 md:mb-5 2xl:mb-10">
                            <Link href="/">
                              <a onClick={() => setMenuIsOpen(false)} className={`font-display text-[8.5vw] md:text-4xl lg:text-5xl 2xl:text-5xl flex items-end text-stroke ${router.asPath === '/' ? 'text-stroke--active' : ''}`}>
                                <span className="block font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-bold mr-2 sm:mr-4 md:mr-8 mb-[3vw] md:mb-[5px] 2xl:mb-[7px] w-8 md:w-6 lg:w-10">01</span>
                                <span className="block text-stroke__item">Home</span>
                              </a>
                            </Link>
                          </li>
                          <li className="block mb-3 md:mb-5 2xl:mb-10">
                            <Link href="/services">
                              <a onClick={() => setMenuIsOpen(false)} className={`font-display text-[8.5vw] md:text-4xl lg:text-5xl 2xl:text-5xl flex items-end text-stroke ${router.asPath.includes('/services') ? 'text-stroke--active' : ''}`}>
                                <span className="block font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-bold mr-2 sm:mr-4 md:mr-8 mb-[3vw] md:mb-[5px] 2xl:mb-[7px] w-8 md:w-6 lg:w-10">02</span>
                                <span className="block text-stroke__item">Services</span>
                              </a>
                            </Link>
                          </li>
                          <li className="block mb-3 md:mb-5 2xl:mb-10">
                            <Link href="/about">
                              <a onClick={() => setMenuIsOpen(false)} className={`font-display text-[8.5vw] md:text-4xl lg:text-5xl 2xl:text-5xl flex items-end text-stroke ${router.asPath === '/about' ? 'text-stroke--active' : ''}`}>
                                <span className="block font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-bold mr-2 sm:mr-4 md:mr-8 mb-[3vw] md:mb-[5px] 2xl:mb-[7px] w-8 md:w-6 lg:w-10">03</span>
                                <span className="block text-stroke__item">About</span>
                              </a>
                            </Link>
                          </li>
                          <li className="block mb-3 md:mb-5 2xl:mb-10">
                            <Link href="/case-studies">
                              <a onClick={() => setMenuIsOpen(false)} className={`font-display text-[8.5vw] md:text-4xl lg:text-5xl 2xl:text-5xl flex items-end text-stroke ${router.asPath.includes('/case-studies') ? 'text-stroke--active' : ''}`}>
                                <span className="block font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-bold mr-2 sm:mr-4 md:mr-8 mb-[3vw] md:mb-[5px] 2xl:mb-[7px] w-8 md:w-6 lg:w-10">04</span>
                                <span className="block text-stroke__item">Case Studies</span>
                              </a>
                            </Link>
                          </li>
                          <li className="block mb-3 md:mb-5 2xl:mb-10">
                            <Link href="/news">
                              <a onClick={() => setMenuIsOpen(false)} className={`font-display text-[8.5vw] md:text-4xl lg:text-5xl 2xl:text-5xl flex items-end text-stroke ${router.asPath.includes('/news') ? 'text-stroke--active' : ''}`}>
                                <span className="block font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-bold mr-2 sm:mr-4 md:mr-8 mb-[3vw] md:mb-[5px] 2xl:mb-[7px] w-8 md:w-6 lg:w-10">05</span>
                                <span className="block text-stroke__item">News</span>
                              </a>
                            </Link>
                          </li>
                          <li className="block mb-3 md:mb-5 2xl:mb-10">
                            <Link href="/contact">
                              <a onClick={() => setMenuIsOpen(false)} className={`font-display text-[8.5vw] md:text-4xl lg:text-5xl 2xl:text-5xl flex items-end text-stroke ${router.asPath === '/contact' ? 'text-stroke--active' : ''}`}>
                                <span className="block font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-bold mr-2 sm:mr-4 md:mr-8 mb-[3vw] md:mb-[5px] 2xl:mb-[7px] w-8 md:w-6 lg:w-10">06</span>
                                <span className="block text-stroke__item">Contact Us</span>
                              </a>
                            </Link>
                          </li>
                        </ul>
                      </nav>

                      <div className="flex flex-wrap items-end w-full mt-auto relative z-50 max-w-2xl 2xl:pr-8">
                        <div className="w-auto mt-auto pb-8">

                              <a href="mailto:hello@weswwim.com" className="text-right md:text-left md:text-lg font-medium block w-full md:w-auto order-2 md:order-1 hover:underline focus:underline">hello@weswwim.com</a>
                        </div>

                      </div>
                    </div>

                    <div className="w-full absolute bottom-0 left-0 right-0">
                      <div className="w-full">
                        <LottieTest/>
                        {/* <Image width={741} height={260} layout="responsive" src="/icons/menu-woman.svg" alt="placeholder" className="w-full" /> */}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>
          
          <AnimatePresence exitBeforeEnter>
            <Component {...pageProps} key={router.asPath} />
          </AnimatePresence>
          </PopupContext.Provider>
        </Context.Provider>
        </NewsletterContext.Provider>
      </AlertContext.Provider>
    </>
  )
}