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
Mar 17th
1. oRPC
Everything starts with base.ts. It is a template.
By defining errors in base.ts, you ensure that every single route in our app speaks the same "language". If a route fails, the frontend recevies a standardized error that it knows how to handle. It also sets the "Request" as the starting context, so every following step knows which URL or headers are being accessed. 

- What is $context?
Think of it as a backpack every request carries as it moves through your server.

So instead of passing variables one by one through 10 different functions, you put them in the "Context backpack". Any middleware or handler down the line can reach into that backpack and pull out the 'request' (to check cookies, URLs, or headers.)

- os.$context<{ request: Request }>().errors   Generic

What they do?
A generic is a way of saying "I don't know exactly what data you are going to use yet, so I am leaving a placeholder. You tell me what the 'Type' is when you use me.

Standard Code: const name = "Morgan" (Fixed to a string).

Generic Code: os.$context<T>() (Can be anything).

so by putting { request: Request } inside the brackets, you are locking in the placeholder. "For this specific 'base' object, the context placeholder T is now officially a Request."

2. z.void()
think of it as a "No luggage allowed" policy at an airport gate.
ex: .input(z.void()) tells the server: "This specific function does not need the user to send any data in the request body."

If you send nothing: "The guard (Zod)" lets you through.
If you try to send data (like {"name": "Morgan"}) the guard stops you and says "I wasn't expecting any data here."

Why use it? Most "List" actions (like listing workspaces) don't need the user to provide information; the server already knows who you are from your login session. 

3. .output(): is a quality control checklist. It ensures the server does not accidentally send back garbage or sensitive secrets.

.output(z.object({
  // 1. A list of badges (The Array)
  badges: z.array(
    z.object({ 
      title: z.string(), 
      color: z.string() 
    })
  ),
  // 2. The User Info (The Custom Type)
  user: z.custom<KindeUser>(),
  // 3. A single string for status
  status: z.string()
}))

-> z.object({...}): this is the "Container". Everything inside must match.

-> z.array(z.object({...})): this says: "I will give you a list. Every single item in that list must have a title and a color"

Now the handshake between the server and our logic will be like if color: 123 (a number) instead of a string, the app will throw an error as the contract is not abided by. 

-> z.custom(): custom is a built-in function provides by the zod library. 

4. Why use () after the Generic?
This is a mix of Typescript (the instructions) and JavaScript (the action).

z.custom<KindeUser> is like looking at a Blueprint for a house.

z.custom<KindeUser>() is actually Building the house so you can stand in it.

so () is an action. In JS, writing the name of a function (z.custom) just points to the tool. Adding the parentheses () actually turns the tool on and creates the validator.

5. The Generic: <KindeUser <...>>
- The angled brackets <>: these are generics. Think of them as a label on a box.
- In the case, KindeUser: This is a complex type provided by  Kinde, but KindeUser is "Generic" itself - it's a box that can hold different types of extra data (metadata). It needs you to tell it what kind of extra data to expect inside.

* The inner generic: Record<string, unknown>
user: z.custom<KindeUser<Record<string, unknown>>>(),

This is where it gets interesting. Inside the KindeUser box, we are putting another box called a "Record".

Record<string, unknown>: This is a standard TypeScript "Utility Type." It is a fancy way of describing a Dictionary or a Plain Object.

-> string: This says, "The Keys (the labels) in this dictionary must be strings." (e.g., "email", "id", "username").

-> unknown: This says, "The Values (the data) can be anything, and I don't know what they are yet."

Record<K, V>: A dictionary with Keys (K) and Values (V).


6. Client State vs Server State
- Client state refers to data managed within the user's browser. Therefore, it exists within the frontend application, managing UI-specific data like dark mode, form inputs, or active navigation tabs. It is local, often ephemeral, and managed via "useState", useReducer.

- Server state refers to data managed on the backend server and fetched via APIs. It is sourced from a db or API that requires syncing with the client. It is persistent, shared, and asynchronous, requiring specialized management for caching, loading, and error states.

7. Hydration
It is a process of taking a static web page (rendered on the server) and making it "alive" and interactive in the browser.

The server sends you a dry, flat sponge (the static HTML). It looks like a sponge, but you can't use it to clean anything yet.

The browser adds "water" (the JS). Suddenly, the sponge expands and becomes a functional, squishy tool you can actually use.

How the Process Works

When you use a framework like Next.js with TanStack Query, hydration happens in three main steps:

    Server-Side Rendering (SSR): The server runs your code, fetches the data (like your list of workspaces), and generates the HTML. It sends this finished HTML to your browser.

        Benefit: The user sees the content almost instantly.

    The Handover: Along with the HTML, the server sends a "script" (JSON) that contains all the data it just fetched.

    Hydration: The browser downloads the JavaScript. It looks at the HTML already on the screen and "attaches" the event listeners (like clicks and hovers). It also "pours" that JSON data into the TanStack Query Cache.


WHY DO WE USE HYDRATION?
Without hydration, the server sends the page, the browser shows the page, the JS loads, so the page goes blank or shows a spinner for a second. The data arrives and the page jumps around as it renders. Because the data was hydrated into the cache on the server, the browser already has the data the moment the JS starts running. There is no second "fetch" and no jumping UI.


