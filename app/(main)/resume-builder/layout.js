import React, { Suspense } from 'react'
import {BarLoader, HashLoader} from 'react-spinners'
function Layout({children}) {
    return (
        <div className='px-5'>
            <Suspense fallback={<HashLoader  className="mt-4" width={"100%"} color="grey" />}>
                {children}
            </Suspense>
        </div>
    )
}




export default Layout;
