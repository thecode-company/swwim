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

export const articlesPerPage = 50;

export const query = `{
  "news": *[_type == "news" && categories[0]->title == 'Advice'] | order(date desc) {
    heroImage {
      asset -> {
        ...
      }
    },
    categories[]-> {
      title
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
  "contact": *[_type == "contact"][0] {
    title,
    email,
    phoneNumber,
    address,
    socialLinks[] {
      title,
      url
    }
  }
}`

const pageService = new SanityPageService(query)

export default function NewsBodyCat({news, contact, numberOfArticles, subPage, index}) {


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
                
                <span className="block bg-blue bg-opacity-20 rounded-full px-4 py-[50px]">Filter By: <span className="font-bold">All</span></span>
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
              </div>
            ) : (
              <></>
            )}
          </Container>
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