import  React,{ ReactNode } from "react";
/*
1. In TypeScript, ReactNode is a very "forgiving" type. It represents anything that can be rendered in a React component.

Think of it as the ultimate container. If you use ReactNode, your children can be:
- HTML Elements (like a <div> or <span>).
- Other React Components.
- Strings or Numbers (plain text).
-Fragments (<>...</>).
- Arrays of any of the above.
- Null or Undefined (meaning nothing is rendered).
- Why use it? It is the most common type used for children because it doesn't restrict what the user can put inside your layout.

2. children: is a prop in React that allows you to pass components as data to other components.
It is what enables Composition.
- The concept: when you wrap content inisde a component tag, like 
<WorkspaceLayout> <MyPage /> </WorkspaceLayout>, React automatically passes <MyPage /> into the 
WorkspaceLayout as a prop named children.
*/
const WorkspaceLayout = ({children}: {children: ReactNode}) => {
    return (
        <div className='flex w-full h-screen'>
            <div className='flex h-full w-16 flex-col items-center bg-secondary py-3
            px-2 border-r border-border'>
                

            </div>
        </div>
    )
};

export default WorkspaceLayout;