import BlockContentWrapper from './block-content-wrapper'
import ImageCarousel from './image-carousel'
import Quote from './quote'
import StatBlock from './stat-block'
import { getSerializers } from './serializers'

const notImplemented = ({ type }) => <h1>Not implemented {type}</h1>

const bodySerializers = {
  block: {
    component: (props) => <BlockContentWrapper {...props} serializers={blockSerializers} />,
    wrapper: ({ children }) => 
      <div className="mb-12 md:mb-16 xl:mb-24 bg-red-500">
        {children}
      </div>
  },
  statBlock: {
    component: StatBlock,
    wrapper: ({ children }) => 
      <div className="mb-12 md:mb-16 xl:mb-24 bg-blue-500">
        {children}
      </div>
  },
  quote: {
    component: Quote,
    wrapper: ({ children }) => 
      <div className="mb-12 md:mb-16 xl:mb-24 bg-green-500">
        {children}
      </div>
  },
  imageCarousel: {
    component: ImageCarousel,
    wrapper: ({ children }) => 
      <div className="mb-12 md:mb-16 xl:mb-24">
        {children}
      </div>
  }
}

export const blockSerializers = getSerializers(bodySerializers)

const BodyRenderer = ({ body }) => {
  if (!body) return <></>
  return body.map((item) => {
    const type = item._type
    const serializer = bodySerializers[type]
    const Component = serializer?.component
    const args = serializer?.args
    const Wrapper = serializer?.wrapper

    if (!Component || !serializer) throw new Error(`No serializer implemented for body object: ${type}`)    
    
    return Wrapper ? <Wrapper key={item._key}><Component {...item} {...args} /></Wrapper> : <Component key={item._key} {...item} {...args} />
  })
}

export default BodyRenderer;