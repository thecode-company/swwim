import Image from 'next/image'
import Layout from './layout'
import Header from './header'
import Footer from './footer'
import Container from './container'
import { fade, fadeSmallDelay, revealInNoDelay, revealInLogoNoDelay, revealInLogoMoveNoDelay, textRevealSmallDelay } from "../helpers/transitions"
import FancyLink from './fancy-link'
import Logo from './logo'
import { motion } from 'framer-motion'
import NewsTeaser from './news-teaser'
import NewsTeaserStacked from './news-teaser-stacked'
import Button from './button'
import SanityPageService from '../services/sanityPageService'
import { NextSeo } from 'next-seo'
import { SmoothScrollProvider } from '../contexts/SmoothScroll.context'
import Socials from './socials'
import SkipButtons from './skip-buttons'
import Link from 'next/link'
import ImageStandard from '../helpers/image-standard'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PopupContext } from '../contexts/popup'

export const articlesPerPage = 7;

export const query = `{
  "news": *[_type == "news"] | order(date desc) [$start ... $stop] {
    heroImage {
      asset -> {
        ...
      }
    },
    categories[]-> {
      title,
      slug {
        current
      }
    },
    date,
    author-> {
      _type,
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
    content,
    title,
    slug {
      current
    }
  },
  "cats": *[_type == "newsCategory"] {
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
  "numberOfArticles": count(*[_type == "news"]),
  "popup": *[_type == "popups"][0] {
    popupTitle,
    popupBannerText,
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
      title,
      slug {
        current
      }
    }
  }
}`

const pageService = new SanityPageService(query)

export default function NewsBody({news, contact, numberOfArticles, subPage, index, cats, popup }) {
  const router = useRouter();

  let newsFirst = news?.slice(0,3);
  let newsSecond = news?.slice(3,5);
  let newsThird = news?.slice(5,7);
  
  const handleChange = event => {
    if (event.target.value == 'all') {
      router.push(`/news`);
    } else {
      router.push(`/news/categories/${event.target.value}`);
    }
  };

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
      image: popup.popupImage
    }])
  }, [])

  return (
    <Layout>
      <NextSeo
        title="Latest Poolside"
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

      <Header theme="white" contact={contact} active="news" />
      
      {/* <motion.section
        initial="initial"
        animate="enter"
        exit="exit"
        className="absolute top-0 left-0 right-0 w-full overflow-visible z-10"
      >
        <motion.div variants={fadeSmallDelay} className="w-[260px] md:w-[420px] xl:w-[500px] 2xl:w-[580px] absolute top-0 left-0 ml-[15%] md:ml-[35%] xl:ml-[40%] 2xl:ml-[45%] mt-[-200px] md:mt-[-300px] 2xl:mt-[-200px] z-0 transform rotate-6">
          <div className="animate--wave--slow origin-top-left">
            <ImageStandard width={551} height={555} layout="responsive" src="/icons/plant-3.svg" alt="Plant Illustration" className="w-full transform rotate-90" />
          </div>
        </motion.div>
      </motion.section> */}

      <motion.section
        initial="initial"
        animate="enter"
        exit="exit"
        className="bg-white bg-noise text-blue pt-[160px] md:pt-[190px]"
      >
        <motion.div variants={fadeSmallDelay} className="relative z-20 overflow-hidden">

          <div className="w-[55%] md:w-[30%] 2xl:w-[25%] absolute top-0 left-0 ml-[-6%] md:ml-[-4%] md:mt-[-5%] 2xl:mt-[-5%] z-0">
            <div className="animate--wave--slow origin-bottom-left">
              <ImageStandard width={302} height={479} layout="responsive" src="/icons/news-leaf.svg" alt="Plant Illustration" className="w-full" />
            </div>
          </div>
          <Container>
            <div className="relative overflow-visible">
              <div className="relative mb-12 md:mb-20 lg:mb-24 2xl:mb-24 flex flex-wrap items-center justify-center">
                <span className="w-full xl:w-auto items-center justify-center mb-8 xl:mb-0 hidden md:flex">
                  {contact && (
                    <>
                      {contact.socialLinks && (
                        <div className="mb-auto">
                          <Socials large links={contact.socialLinks} />
                        </div>
                      )}
                    </>
                  )}
                </span>
                <h1 className="block font-display uppercase text-[9.7vw] md:text-[6.45vw] lg:text-[5.75vw] 2xl:text-[80px] leading-none relative z-10 text-center mx-auto w-full xl:w-auto pb-0 mb-5 xl:mb-0">
                  <span className="block overflow-hidden w-full xl:w-auto">
                    <motion.span variants={textRevealSmallDelay} className="block overflow-hidden">
                      Latest Poolside
                    </motion.span>
                  </span>
                </h1>
                
                <span className="block bg-blue-light bg-opacity-20 rounded-full px-4">
                  Filter By:&nbsp;
                  <select onChange={handleChange} name="cats" id="cats" className="bg-transparent appearance-none font-bold w-auto py-2 focus:outline-none focus:border-none">
                    <option value={'all'}>All Posts</option>
                    {cats?.map((e, i) => {
                      return (
                        <option key={i} value={e.slug.current}>{e.title}</option>
                      )
                    })}
                  </select>
                </span>
              </div>
            </div>

            <div className="border-t border-b border-blue py-4 md:py-6 relative z-10 overflow-hidden">
              <div className="overflow-hidden">
                <motion.div variants={textRevealSmallDelay}>
                  <div className="relative flex overflow-x-hidden font-display uppercase md:text-[2vw] 2xl:text-3xl">
                    <div className="animate-marquee whitespace-nowrap">
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                    </div>

                    <div className="absolute top-0 animate-marquee2 whitespace-nowrap">
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                      <span className="mx-1">Swwim News</span>
                      <span className="mx-1">&bull;</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            { subPage ? (
              <div className="mb-8 md:mb-12 2xl:mb-16 relative z-10 overflow-x-hidden">
                {news?.map((article, i) => {
                  return (
                    <NewsTeaser
                      key={i}
                      image={article.heroImage.asset}
                      href={`/news/${article.slug.current}`}
                      heading={article.title}
                      category={article.categories ? article.categories[0].title : null}
                      date={article.date ?? null}
                      author={article.author ?? null}
                      content={article.content}
                    />
                  )
                })}
                {numberOfArticles > 7 && (
                  <div className="mt-12 md:mt-16 xl:mt-24">
                    <SkipButtons index={index} maxIndex={Math.floor(numberOfArticles/articlesPerPage)} />
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-8 md:mb-12 2xl:mb-16 relative z-10 overflow-x-hidden">
              {newsFirst.map((article, i) => {
                return (
                  <NewsTeaser
                    key={i}
                    image={article.heroImage.asset}
                    href={`/news/${article.slug.current}`}
                    heading={article.title}
                    category={article.categories ? article.categories[0].title : null}
                    date={article.date ?? null}
                    author={article.author ?? null}
                    content={article.content}
                  />
                )
              })}
            </div>
            )}
            <div className="flex flex-wrap w-full mb-3 md:mb-16 2xl:mb-20">
              <div className="w-full md:w-8/12 lg:w-9/12">
                { !subPage && (
                  <div className="flex flex-wrap -mx-3 md:-mx-6">
                    {newsSecond.map((e, i) => {
                      return (
                        <div key={i} className="w-full md:w-1/2 px-3 md:px-6 mb-5 md:mb-0">
                          <NewsTeaserStacked
                            heading={e.title}
                            categories={e.categories}
                            image={e.heroImage}
                            author={e.author}
                            date={e.date}
                            href={`/news/${e.slug.current}`}
                            content={e.content}
                          />
                        </div>    
                      )
                    })}
                  </div>
                )}
              </div>
              { !subPage && (
                <div className="w-full md:w-4/12 lg:w-3/12">
                  {contact?.socialLinks.map((item, i) => {
                    return (
                      <div key={i}>
                        {item.title == 'instagram' || item.title == 'Instagram' && (
                          <div className="md:pl-12 w-full">
                            <div className="w-full bg-blue-dark text-white p-5 md:p-6 2xl:p-10 mb-5 md:mb-8 2xl:mb-12">
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="bg-blue bg-noise mx-auto w-24 md:w-32 h-24 md:h-32 flex items-center justify-center mb-3 md:mb-5 group relative">
                                <Logo width="w-8/12" />

                                <img src="/images/insta.gif" alt="Insta Gif" className="w-full h-full absolute inset-0 object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-500"></img>
                              </a>
                              
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto text-sm md:text-lg 2xl:text-xl font-medium block text-center">@weswwim</a>
                            </div>

                            <div className="w-full hidden md:block">
                              <div className="w-10/12 mx-auto animate--float">
                                <ImageStandard width={210} height={105} layout="responsive" src="/icons/soak-up.svg" alt="Soak Up The Latest handwritten text" className="w-full" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Container>
          { !subPage && (
            <div className="mt-4 2xl:mt-8 relative z-10 overflow-hidden">
              <div className="relative flex overflow-x-hidden font-display uppercase text-5xl md:text-[5.5vw] xl:text-[4.5vw] 2xl:text-[80px]">
                <div className="animate-marquee whitespace-nowrap">
                  <span className="mx-1">Communicating Your Brand</span>
                  <span className="mx-2">&bull;</span>
                  <span className="mx-1">Communicating Your Brand</span>
                  <span className="mx-2">&bull;</span>
                  <span className="mx-1">Communicating Your Brand</span>
                  <span className="mx-2">&bull;</span>
                  <span className="mx-1">Communicating Your Brand</span>
                  <span className="mx-2">&bull;</span>
                </div>

                <div className="absolute top-0 animate-marquee2 whitespace-nowrap">
                <span className="mx-1">Communicating Your Brand</span>
                  <span className="mx-2">&bull;</span>
                  <span className="mx-1">Communicating Your Brand</span>
                  <span className="mx-2">&bull;</span>
                  <span className="mx-1">Communicating Your Brand</span>
                  <span className="mx-2">&bull;</span>
                  <span className="mx-1">Communicating Your Brand</span>
                  <span className="mx-2">&bull;</span>
                </div>
              </div>
            </div>
          )}

          { !subPage && (
          <Container>
            <div className="flex flex-wrap w-full mb-12 md:mb-16 2xl:mb-20 relative overflow-visible pt-8 md:pt-16 2xl:pt-24">
              <div className="w-[80%] md:w-[45%] 2xl:w-[45%] absolute top-0 left-0 ml-[-28%] md:ml-[-20%] md:mt-[-0%] 2xl:mt-[-5%] z-0">
                <div className="animate--wave--slow origin-bottom-left">
                  <ImageStandard width={775} height={1092} layout="responsive" src="/icons/palm-tree.svg" alt="Plant Illustration" className="w-full" />
                </div>
              </div>

              <div className="w-[24%] md:w-[20%] absolute top-0 right-0 mr-[-14%] md:mr-[-10%] 2xl:mr-[-9%] mt-[100%] md:mt-[30%] z-0">
                <ImageStandard width={278} height={276} layout="responsive" src="/icons/plant-2.svg" alt="Plant Illustration" className="w-full transform rotate-12" />
              </div>

              <div className="w-full md:w-4/12 lg:w-3/12 mb-8 md:mb-0 relative z-10">
                <div className="md:pr-12 w-full">
                  <div className="w-full bg-[#07398A] text-white p-5 md:p-6 2xl:p-10">
                    <span className="block font-display uppercase text-xl md:text-2xl 2xl:text-3xl text-center mb-5 md:mb-8">See how we can help your business grow today</span>

                    <div className="flex items-center justify-center">
                      <div className={`inline-block p-px overflow-hidden relative mb-0 pb-0`}>
                        <Link href="/contact">
                          <a className={`rounded-full text-center inline-block font-bold group transition-colors ease-in-out duration-500 bg-white text-blue ring-white px-4 md:px-6 py-2 relative overflow-hidden`}>
                            <span className="block relative z-10">Contact Us</span>
                            <div className="absolute bottom-0 left-0 w-full h-0 bg-[#EEE1D9] group-hover:h-full group-focus:h-full transition-all ease-in-out duration-500 z-0 scale-110 rounded-full"></div>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-8/12 lg:w-9/12 relative z-10">
                <div className="flex flex-wrap -mx-3 md:-mx-6">
                  {newsThird.map((e, i) => {
                    return (
                      <div key={i} className="w-full md:w-1/2 px-3 md:px-6 mb-5 md:mb-0">
                        <NewsTeaserStacked
                          heading={e.title}
                          categories={e.categories}
                          image={e.heroImage}
                          author={e.author}
                          date={e.date}
                          href={`/news/${e.slug.current}`}
                          content={e.content}
                        />
                      </div>    
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="w-full mb-4 md:mb-12 2xl:mb-20">
              <div className="flex flex-wrap -mx-3 md:-mx-6">
                <div className="w-1/2 md:w-1/3 px-3 md:px-6 mb-5 md:mb-0">
                  {/* <NewsTeaserStacked supporting heading="How Alcohol Brands Can Get Seen on TikTok #TheLowdown" /> */}
                </div>
                <div className="w-1/2 md:w-1/3 px-3 md:px-6 mb-5 md:mb-0">
                  {/* <NewsTeaserStacked supporting heading="How Alcohol Brands Can Get Seen on TikTok #TheLowdown" /> */}
                </div>
                <div className="w-1/2 md:w-1/3 px-3 md:px-6 mb-5 md:mb-0">
                  {/* <NewsTeaserStacked supporting heading="How Alcohol Brands Can Get Seen on TikTok #TheLowdown" /> */}
                </div>
              </div>
            </div>
            
            {numberOfArticles > 7 && (
              <div className="mb-12 md:mb-16 xl:mb-24">
                <SkipButtons index={index} maxIndex={Math.floor(numberOfArticles/articlesPerPage)} />
              </div>
            )}

            {/* <ul className="flex flex-wrap items-center justify-center mb-12 md:mb-16 2xl:mb-24">
              <li>
                <svg className="w-8 mt-2 transform rotate-180 mr-5 md:mr-8" viewBox="0 0 42 43" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="21" cy="21.5" r="21" fill="#1658B3"/><path d="M12.227 20.603H27.86v2.017H12.227v-2.017z" fill="#FFF"/><path d="M23.523 28.37l-1.413-1.413 5.346-5.345-5.346-5.345 1.413-1.412 6.757 6.757-6.757 6.758z" fill="#FFF" /></svg>
              </li>
              <li className="block border-b border-blue p-2 mx-1 md:mx-3 md:text-lg">1</li>
              <li className="block border-b border-blue border-opacity-20 p-2 mx-1 md:mx-3 md:text-lg">2</li>
              <li className="block border-b border-blue border-opacity-20 p-2 mx-1 md:mx-3 md:text-lg">3</li>
              <li className="block border-b border-blue border-opacity-20 p-2 mx-1 md:mx-3 md:text-lg">...</li>
              <li className="block border-b border-blue border-opacity-20 p-2 mx-1 md:mx-3 md:text-lg">16</li>
              <li>
                <svg className="w-8 mt-2 ml-5 md:ml-8" viewBox="0 0 42 43" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="21" cy="21.5" r="21" fill="#1658B3"/><path d="M12.227 20.603H27.86v2.017H12.227v-2.017z" fill="#FFF"/><path d="M23.523 28.37l-1.413-1.413 5.346-5.345-5.346-5.345 1.413-1.412 6.757 6.757-6.757 6.758z" fill="#FFF" /></svg>
              </li>
            </ul> */}
          </Container>
          )}
        </motion.div>

        <motion.div variants={fadeSmallDelay} className="relative z-10 overflow-hidden">
          <Footer contact={contact} />
        </motion.div>
      </motion.section>
      </SmoothScrollProvider>
      </div>
    </Layout>
  )
}