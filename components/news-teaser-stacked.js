import Image from "next/image";
import Link from "next/link";
import ImageWrapper from "../helpers/image-wrapper";
import spacetime from 'spacetime'
const readingTime = require('reading-time');

function toPlainText(blocks = []) {
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      return block.children.map(child => child.text).join('')
    })
    .join('\n\n')
}

export default function NewsTeaserStacked({ heading, author, theme, supporting, image, date, categories, href, content}) {
  let d = spacetime(date)
  let estimatedReadingTime = readingTime(toPlainText(content));

  return(
    <Link href={href}>
      <a className="flex flex-wrap text-current group">
        <div className="w-full mb-5">
          <div className="bg-blue-dark overflow-hidden">
            <div className="transform group-hover:scale-110 group-focus:scale-110 transition ease-in-out duration-500">
              <ImageWrapper
                image={image}
                className="w-full will-change transform scale-[1.01]"
                baseWidth={620}
                baseHeight={380}
                alt={heading}
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="flex flex-wrap items-start min-h-full">
            <div className="">
              <div className="w-full flex flex-wrap items-end md:items-center mt-auto mb-2 md:mb-4">
                <div className="flex flex-wrap">
                  { categories && (
                    <span className="font-display uppercase text-sm mb-1 md:mb-0 mr-3 md:mr-5 flex items-center">
                      <svg className="w-3 md:w-4 mr-2 md:-mt-1" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.007 14.76a.823.823 0 000-1.163l-.173-.173 1.948-.865.06.067.878.863a2.68 2.68 0 004.22-3.21l2.167-.958.49.484a.822.822 0 001.162-1.163L6.36.24a.824.824 0 00-1.163 1.166l.408.408-4.115 9.266-.083-.086A.823.823 0 00.24 12.157l2.604 2.603c.322.32.841.32 1.163 0zm5.396-2.375a1.121 1.121 0 01-1.583 0l-.503-.51 2.188-.965c.342.447.299 1.08-.102 1.476zM6.854 3.061l1.197 1.197L3.55 10.5l3.305-7.439z" fill="currentColor"/></svg>
                      <span className="block -mb-px">
                        {categories[0].title}
                      </span>
                    </span>
                  )}
                  
                  {date && (
                    <span className="font-display uppercase text-sm mb-1 md:mb-0 opacity-60 mr-3 md:mr-10 block">{d.unixFmt('dd.MM.yy')}</span>
                  )}
                  
                  {estimatedReadingTime && (
                    <span className="font-display text-sm mb-1 md:mb-0 flex items-center">
                      <svg className="w-3 md:w-4 mr-2" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 17c4.693 0 8.5-3.807 8.5-8.5S13.193 0 8.5 0A8.502 8.502 0 000 8.5C0 13.193 3.807 17 8.5 17zM7.512 4.116a.597.597 0 011.193 0v4.507l2.49 1.873a.617.617 0 01.124.844.576.576 0 01-.473.247.555.555 0 01-.35-.124L7.76 9.405a.604.604 0 01-.247-.473V4.116z" fill="currentColor"/></svg>
                      <span className="block -mb-px">
                        {estimatedReadingTime.text}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <h3 className={`block font-display pr-5 leading-snug group-hover:opacity-60 transition-opacity ease-in-out duration-300 ${supporting ? 'text-base md:text-lg xl:text-2xl 2xl:text-3xl' : 'text-lg md:text-xl xl:text-3xl 2xl:text-4xl'}`}>{heading}</h3>

              {author && (
                <span className="text-sm md:text-base font-display flex flex-wrap items-center">
                  <span className="block">By {author.firstName}</span>
                  {(author._type === "team" ? author?.imageAuthor : author?.image) && (
                  <div className="w-10 h-10 rounded-full border-white border-2 ml-3 relative">
                    <ImageWrapper
                      image={author._type === "team" ? author.imageAuthor.asset : author.image.asset}
                      className="rounded-full will-change object-cover object-left absolute inset-0"
                      baseWidth={350}
                      baseHeight={350}
                      fill
                      alt={author.name}
                    />
                  </div>
                )}
                </span>
              )}
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}