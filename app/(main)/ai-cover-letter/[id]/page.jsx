import React from 'react'

const CoverLetter = async({ params })  =>{
   const id = await params.id;
   return(
    <div>
        CoverLetter: <h2>{id}</h2>
    </div>
   )
}

export default CoverLetter
