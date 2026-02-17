// In Next.js App Router, .tsx files must use export default because 
// Next.js expects a default export to render the page.
// So the purpose of it is for Next.js to know which component 
// is to be rended as a page.

// Why not named exports?
/*
    That's because Named exports are used for reusable components.
    Default exports are for pages / layouts.
*/

/*
export default	Required for Next.js to find and render the page
File location	Determines the URL route
Default export	The component Next.js renders
Named exports	For reusable components.
*/

import React from 'react'

const WorkSpacePage = () => {
  return <div>page</div>;
}

export default WorkSpacePage; // <- Still a default export, but now we can name it whatever we want.