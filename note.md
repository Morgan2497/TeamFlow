what is "export default"?
Think of your file as a Document. If another file wants to use
your page, you have to publish it so it's visible outisde its own house.

* export: This makes the component available for other files to 'import'

* default: This tells JS: "If someone asks for this file, the component is the main thing they are looking for."

The rules of default:
1. Only one per file.
2. Flexible naming: when you import a default, you can actually change the name.

// 1. The (now optional) tool import
import React from 'react' 

// 2. Defining the "Blueprint" (The Arrow Function)
// WorkspacePage is a constant that holds a function
const WorkspacePage = () => {
  return (
    // 3. The JSX (What shows up on the screen)
    <div>WorkspacePage</div>
  )
}

// 4. Publishing the Blueprint
// This allows Next.js to use this function as a real webpage
export default WorkspacePage






========================================================================================================================================================================

1. layout.tsx (The Frame)
The layout.tsx is the skeleton of the website. It handles the parts of the app that stay the same even when you navigate to different pages.

sidebar, footer and so on. 

2. page.tsx (The picture)
The page is the unique content of a specific URL.
when you move from /workspace/i to /workspace/2, the page.tsx content is what actually changes.

========================================================================================================================================================================

1. children
In React, if you build a component called <Card />, you don;t want it to only ever show one specific thing. You want to be able to put anything inside it.

Think of a component as a "vending machine." The machine has a specific frame and logic (the component code), but it has a "slot" in the middle. Whatever you put into
that slot from the outside is what the machine will display. 
And we call the "slot" as "children" in React.


2. ReactNode
When using typescript, you have to tell the computer what kind of data is allowed to go into that "slot". It basically says "Anything that React can render is allowed here".
What does ReactNode include?

    JSX Elements: <div></div> or <MyOtherComponent />

    Strings: "Hello"

    Numbers: 42

    Arrays: of any of the above.

    Fragments: <> ... </>

    Null or Undefined: (If you want to render nothing).



========================================================================================================================================================================

1. cn: is an utility functions that stands for "Class Name" and it is a helper function used to conditionally merge Tailwind CSS classes.

* The Building Blocks: What is cn made of?

* The Ingredients (The Team)

Inside cn, you have two specialized workers:

    Worker A (clsx): The "Decision Maker."
    He decides which clothes (classes) to put on based on the weather (conditions).

        Logic: "If it's raining, put on a jacket. If not, don't."

    Worker B (tailwind-merge): The "Conflict Resolver."
    He makes sure you aren't wearing two hats at the same time.

        Logic: "You tried to put on a Blue Hat AND a Red Hat. I’ll keep the Red one since you picked it last."

* The Problem: "The Overlapping Paint"

Imagine you are painting a wall.

    The component says: "Paint this wall Blue."

    You (from the outside) say: "Wait, paint it Red."

In standard CSS, sometimes the wall ends up a messy purple, or stays blue because the "Blue" rule was written lower down in a file you can't see.

cn fixes this by stripping away the old paint (Blue) before applying the new paint (Red).

* Use Case 1: The "If/Then" (Conditional)

Without cn, you have to use "Template Literals" (those messy backticks and dollar signs). It looks like a math equation:
className={base-style ${isActive ? 'active-style' : ''}} 

With cn, it’s like a grocery list:
className={cn("base-style", isActive && "active-style")}
It’s much easier to read. If isActive is false, it simply ignores that part of the list.

* Use Case 2: The "Master Template" (Customization)

In TeamFlow, you’ll build a WorkspaceHeader. You want it to always be 60px tall and have a border.

    The Component: className={cn("h-[60px] border-b", className)}

    The Secret: By putting the className (the stuff you pass in) at the end, you give it the power to override anything that came before it.

If you later call <WorkspaceHeader className="h-[100px]" />, cn sees two heights and says: "Okay, the user specifically asked for 100px here, so I will delete the 60px."

2. Why do we add "use client"?
In Next.js, we have Server Components and Client Components.
* Server Components (Default): These stay on the server, they are great for security and speed because they don't send extra JS to the user's browser. However, they can't be interactive. They can't handle clicks, form inputs, or "remember" things.

* Client Components: These are sent to the browser. They are the only components that can use Hooks (like useState) and Even Listeners (like onClick).

In summary, React components are "stateless" by defauly that they forget everyrthing as soon as they render. If you want a component to remember that a button was clicked or that a modal is open, you need to use "useState".

3. Destructuring line.
const [open, setOpen] = useState(false)

- Let's look at what useState actually returns. When you call useState(false), it returns an Array with exactly two items: 
[currentValue functionToUpdateValue].

- The 1st item is always the value (the "Getter").

- The 2nd item is always the function (the "Setter").

* The following question could be related to useState we talked about earlier.
In our code, <Dialog open={open} onOpenChange={setOpen}>
We want to control it.
- open={open}: We tell the Dialog: "Look at our 'memory' (the state) to decide if you should show up."
- onOpenChange={setOpen}: We tell the Dialog: "If the user clicks the 'X' or clicks outside, run our 'Setter' function to update our memory to false."

============================================================================================

1. asChild.
<DialogTrigger>
  <Button variant="outline">Click Me</Button>
</DialogTrigger>

What is going to happen is React will actually render this in your brower as
<button> <button>Click Me</button> </button>
**This is a problem because**
-> Invalid HTML: You aren't allowed to put a button inside another button. It breaks accessibility and can cause weird click bugs.
-> Double styling: You might get weird borders or shadows from two overlapping elements.

***SOLUTION*** "asChild"
<DialogTrigger asChild>
  <Button variant="outline">Click Me</Button>
</DialogTrigger>

The browser now sees only ONE clean element
<button class="outline-styles...">Click Me</button>

**SUMMARY**
Nesting a component -> Do you use asChild? -> yes -> why? -> If the child is another component (like <Button> <Link>,) use it to avoid double tags.


2. useForm (brain: the controller)

* const form = useForm();

this line initializes the brain of your form. Even though it is only one line, it is now a massive object containing everything needed to track
- what has the user typed? (values)
- are there any errors? (validation)
- has the user clicked into this box yet? (touched state)

* <Form {...form}>
{...form} syntax is called "spreading props". It takes all the tools inside your "Brain" and provides them to every component inside the wrapper.

**So now <Form> wrapper is a radio tower that is broadcasting the form's state to every sub-component**

<FormField 
  control={form.control} // 1. Connecting to the Brain
  name="name"            // 2. The "ID" in the database
  render={({ field }) => ( // 3. The "Teleportation" function
    <FormItem>
       ...
       <Input {...field} /> // 4. Attaching the logic
    </FormItem>
  )} 
/>

3. resolver
    const form = useForm({
        resolver: zodResolver(workspaceSchema),
    });

Without the resolver, this would be letting everything in so no validation check point exists. You could submit an empty name, a number etc.

With the resolver, now you have handled the validation check point.

as you can see, the name has to be 2 < n < 50, so it will throw a message something like "String must contain at least 2 characters".
import { z } from "zod";

export const workspaceSchema = z.object({
    name: z.string().min(2).max(50),
});

==============================================================================================================================================================================================

