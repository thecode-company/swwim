// New file to break the circular dependency
export const getSerializers = (components) => {
  const res = {}
  for (const [key, value] of Object.entries(components)) {
    if (key === 'block') continue
    const Component = value.component
    res[key] = (props) => <Component {...props.node} />
  }
  return res
} 