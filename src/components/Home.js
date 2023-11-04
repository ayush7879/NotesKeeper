import React from 'react';
import Notes from './Notes';
export const Home = (props) => {
   let {showalert}=props
  return (
   <div>
<Notes showalert={showalert}/>
</div>

  )
}
export default Home
