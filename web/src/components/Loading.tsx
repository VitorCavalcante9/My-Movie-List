import { useLoading, Oval } from '@agney/react-loading';

export function Loading(){
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Oval />
  });

  return(
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div {...containerProps} style={{ 
        width: '100px'
      }}>
        {indicatorEl}
      </div>
    </div>
  )
}