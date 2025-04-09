import Image from 'next/image'
import Layout from '../components/layout'
import Container from '../components/container'
import { fade, fadeSmallDelay, revealInNoDelay, revealInLogoNoDelay, revealInLogoMoveNoDelay, textRevealSmallDelay } from "../helpers/transitions"
import Logo from '../components/logo'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import ImageStandard from '../helpers/image-standard'
import { useRouter } from 'next/router'
import { getRobotsFromSeo, SchemaJsonLd } from '../helpers/seo-utils'
import SanityPageService from '../services/sanityPageService'

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
  "seo": *[_type == "seo"][0] {
    metaTitle,
    metaDesc,
    shareGraphic {
      asset {
        url
      }
    }
  }
}`

const pageService = new SanityPageService(query)

export default function Contact(initialData) {
  const { data: { contact, seo } } = pageService.getPreviewHook(initialData)()
  const router = useRouter();
  const canonicalUrl = `https://www.weswwim.com${router.asPath}`;

  // Create schema data for contact page
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Swwim',
    description: 'Get in touch with Swwim - Social, Digital & Content Creation Agency',
    url: 'https://www.weswwim.com/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'Swwim',
      telephone: contact?.phoneNumber || '',
      email: contact?.email || '',
      address: {
        '@type': 'PostalAddress',
        streetAddress: contact?.address || '',
      },
      url: 'https://www.weswwim.com',
      sameAs: contact?.socialLinks?.map(link => link.url) || [],
    }
  };

  return (
    <Layout>
      <NextSeo
        title="Contact"
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
        }}
      />

      {/* Add Schema.org data */}
      <SchemaJsonLd schemas={[contactPageSchema]} />

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

      <motion.section
        initial="initial"
        animate="enter"
        exit="exit"
        className="bg-blue-dark bg-noise text-white overflow-hidden min-h-screen flex md:flex-wrap py-12 md:pt-24 md:pb-[14vh] 2xl:pt-32 2xl:pb-[17vh]"
      >
        {/* Lady With Megaphone */}
        <motion.div variants={fadeSmallDelay} className="w-[44%] md:w-[32%] lg:w-[30%] xl:w-[30%] 2xl:w-[420px] absolute bottom-0 right-0 z-10 mr-[-10%] mb-[0%] md:mr-[-6%] 2xl:mr-[-80px] md:max-h-[550px] 2xl:max-h-[700px]">
          <ImageStandard height={700} width={400} src="/icons/contact-lady.svg" alt="Woman With Megaphone Illustration" layout="responsive" priority />
        </motion.div>

        {/* Bottom Middle Bigger Leaf */}
        {/* <motion.div variants={fadeSmallDelay} className="w-[45%] md:w-[40%] xl:w-[35%] 2xl:w-[35%] absolute bottom-0 right-0 ml-[-39%] md:mr-[10%] xl:mr-[2%] 2xl:ml-[-19%] mb-[-26%] md:mb-[-24%] xl:mb-[-21%] 2xl:mb-[-20%] z-0 transform -rotate-45">
          <ImageStandard width={551} height={555} layout="responsive" src="/icons/plant-3.svg" alt="Plant Illustration" className="w-full transform -rotate-90" priority />
        </motion.div> */}

        {/* Middle Right Monsterra */}
        <motion.div variants={fadeSmallDelay} className="w-[33%] md:w-[24%] xl:w-[20%] 2xl:w-[320px] absolute top-0 right-0 mr-[-14%] md:mr-[-10%] 2xl:mr-[-140px] mt-[35vh] md:mt-[16vh] xl:mt-[0%] z-0">
          <ImageStandard width={278} height={276} layout="responsive" src="/icons/plant-2.svg" alt="Plant Illustration" className="w-full transform -rotate-45" priority />
        </motion.div>

        {/* Middle Leaf Monsterra */}
        {/* <motion.div variants={fadeSmallDelay} className="w-[35%] md:w-[38%] xl:w-[25%] 2xl:w-[22%] absolute bottom-0 left-0 ml-[-18%] md:ml-[-25%] xl:ml-[-18%] 2xl:ml-[-12%] mb-[70%] md:mb-[40%] xl:mb-[35%] 2xl:mb-[35%] z-0">
          <ImageStandard width={278} height={276} layout="responsive" src="/icons/plant-2.svg" alt="Plant Illustration" className="w-full transform -rotate-180" priority />
        </motion.div> */}

        {/* Bottom Left Bigger Leaf */}
        <motion.div variants={fadeSmallDelay} className="w-[65%] md:w-[44%] xl:w-[38%] 2xl:w-[35%] absolute bottom-0 left-0 ml-[-39%] md:ml-[-25%] xl:ml-[-20%] 2xl:ml-[-19%] mb-[0%] md:mb-[3%] xl:mb-[4%] 2xl:mb-[2%] z-0">
          <ImageStandard width={551} height={555} layout="responsive" src="/icons/plant-3.svg" alt="Plant Illustration" className="w-full transform -rotate-12" priority />
        </motion.div>

        {/* Bottom Left Leaf */}
        <motion.div variants={fadeSmallDelay} className="w-[45%] md:w-[30%] xl:w-[28%] 2xl:w-[28%] absolute bottom-0 left-0 ml-[-20%] md:ml-[-15%] xl:ml-[-13%] 2xl:ml-[-12%] mb-[-10%] md:mb-[-7%] xl:mb-[-8%] 2xl:mb-[-10%] z-0">
          <ImageStandard width={267} height={253} layout="responsive" src="/icons/plant-4.svg" alt="Plant Illustration" className="w-full transform" priority />
        </motion.div>

        <motion.div variants={fadeSmallDelay} className="relative z-30 flex flex-wrap w-full">
          <div className="md:mb-auto w-full">
            <Container>
              <div className="flex mb-8 md:mb-12 2xl:mb-20">
                <Link href="/">
                    <a className="flex flex-wrap space-x-3 items-center ring-white group">

                    <span className="border border-white border-opacity-30 rounded-full relative overflow-hidden group-hover:border-opacity-100 ease-in-out transition-all duration-500 transform rotate-90">
                      <svg className="absolute top-0 left-0 -translate-y-12 group-hover:translate-y-0 transition ease-in-out duration-500 w-8 transform rotate-180" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 16.57l-6.188-6.232-6.188 6.231M17.812 10.338V25" stroke="currentColor" strokeWidth="1.008"/></svg>

                      <svg className="group-hover:translate-y-12 transition ease-in-out duration-500 w-8 transform rotate-180" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 16.57l-6.188-6.232-6.188 6.231M17.812 10.338V25" stroke="currentColor" strokeWidth="1.008"/></svg>
                    </span>
                      
                      {/* <svg className="w-8 transform -rotate-90 group-hover:scale-125 transition-transform ease-in-out duration-300" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><circle opacity=".324" cx="17.5" cy="17.5" r="16.5" transform="rotate(-180 17.5 17.5)" stroke="currentColor" strokeWidth="1.12"/><path d="M24 16.57l-6.188-6.232-6.188 6.231M17.812 10.338V25" stroke="currentColor" strokeWidth="1.008"/></svg> */}
                      <span className="block font-bold transition-opacity ease-in-out duration-300 group-hover:opacity-60">Back to site</span>
                    </a>
                  </Link>
              </div>
            </Container>
          </div>

          <div className="md:mt-auto w-full">
            <Container>
              <div className="mb-8 md:mb-0 md:mx-20 xl:mx-32 2xl:mx-40">
                <span className="block font-bold uppercase mb-6 2xl:mb-8 text-lg tracking-widest overflow-hidden">
                  <motion.span variants={textRevealSmallDelay} className="block">Dear swwim...</motion.span>
                </span>

                <form action="https://formspree.io/f/xpzkerjy" method="POST">
                  <textarea
                    className="bg-transparent text-white font-sans text-xl md:text-2xl 2xl:text-3xl w-full ring-white mb-0 md:mb-12 2xl:mb-20"
                    placeholder="What can we do for you...?"
                    name="message"
                    rows="7"
                  />

                  <div className="border border-white w-full flex flex-wrap mt-auto">
                    <input
                      className="flex-1 p-5 md:p-8 bg-transparent text-white font-sans font-bold w-full focus:outline-none ring-white"
                      name="_replyto"
                      type="email"
                      placeholder="Your email address.."
                    />
                    <div className="w-auto border-l border-white">
                      <button
                        className="text-center font-bold w-full h-full flex items-center justify-center ring-white md:text-lg px-5 md:px-8 hover:bg-black hover:bg-opacity-10 transition ease-in-out duration-300"
                        type="submit"
                      >Send <span className="hidden md:inline-block">&nbsp;your message</span></button>
                    </div>
                  </div>
                </form>
              </div>
            </Container>
          </div>
        </motion.div>
      </motion.section>
    </Layout>
  )
}

export async function getStaticProps(context) {
  return pageService.fetchQuery(context)
}
