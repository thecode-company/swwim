import BlockContent from '@sanity/block-content-to-react'

const BlockContentWrapper = ({ text, serializers = {} }) => {
  return (
    <BlockContent
    serializers={{ 
      types: serializers,
      container: ({ children }) => children
    }}
      blocks={text}
    />
  )
}
export default BlockContentWrapper
