
1. CRA (create-react-app) issue with TypeScript's tsconfig.json paths
    - Bug: The following changes are being made to your tsconfig.json file: compilerOptions.paths must not be set (aliased imports are not supported)
    - Fix: Using baseUrl in tsconfig. React will render all import like 'path' as '{baseUrl}/path'
    - Note: All further configurations need to be made to webpack will go into craco.config.js

2. Next.js migration to basic React.js
    - Remove all next-related package, delete node_modules
    - Install react-scripts (and @craco/craco if webpack need to be configured)
    - Add index.html to public folder (with a div with id="root"?)
    - Check import statements
    - Run the react-scripts/craco 

3. Working with Semantic UI
    - Well-integrated with TailwindCSS
  
    - Note for using Dropdown
      - The outer element when use 'trigger' attribute is the 'trigger'
      - Should wrap Dropdown in a 'div' to easily move things around
      - The Dropdown.Menu can be expand by using padding/margin to push the size
      - Depends on the layout, add the className="left" (right by default) to orient the dropdown orientation (note that this will also applied to all the child drop down)
  
    - Note for using \<i\>
      - The \<i\> (icon tag) is kinda hard to use and position because the icon is actually put in ::before
      - Try using \<Icon\>
      - Tips found (22/10/2021):
        - When using icon, make sure to use flex with items-baseline. This will render the icon center of the text (as the icon is a little bit off center from the top)

4. Working with React Router
    - Use `Router` once to map all basic routes (usually in index.tsx or seperate into a routes file)
    - Nesting more specific route in each basic route main page using `<Switch>`and `<Route>` (don't use `<Router>` / `<BrowserRouter>`)
    - Redirect can use path, or object if needs more specific options (pathName, state, search)
    - `withRouter()` provide {match, location, history} for components through 'props'
    - useRouteMatch hooks provide {path, url} to use in further routing

5. Working with React array (mapping data to elements)
    - Remember to wrap the `map()` in a JSX Element
    - Add key to each element (maybe another wrap layer to put the key in)

6. Working with TailwindCSS correctly (my ways)
    - Make sure the parent box is in the right size. This will help with later hover:bg and easier positioning
    - Use ```flex``` or ```flex-col``` to display to your needs
    - Useful combination: flex + ml-auto:
      - 2 elements of a same parent, one use flex, the later use ml-auto
      - The later will be push to the end of the container ✔
      - Still be able to apply margin/padding ✔

7. Working with Firebase Authentication
    - Use async/await for all auth actions
    - Avoid using ```getAuth().currentUser``` because it's unreliable. currentUser refer to the 'right now' user in the app, which might not be initialized or existed at the call time
    - Use ```onAuthStateChanged()``` to listen to auth changed (Recommended way to get currentUser)
    - Call ```unsubscribe()``` (the function return by some auth function) in componentWillUnmount

8. Working with Firebase Realtime Database
    - ```onChildAdded()``` will also be called on first load. Each child will have 1 onChildAdded() correspond call
    - My ways to solve this: 
        - Call onValue() to fetch all data at once, add onlyOnce option to remove the listener (without having to call unsubscribe)
        - Use a state to indicate first load or not
        - Use ```onChildAdded()``` but not call anything till the first load state is 'false'

    - More notes:
        - set() will overwrites all data at the given destination
        - Continue...
  
    - References:
        - https://firebase.google.com/docs/database/web/read-and-write

9. Scrolling with flex and React
    - References: 
        - https://stackoverflow.com/questions/21515042/scrolling-a-flexbox-with-overflowing-content
        - https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
    - Avoid using ```justify-content: flex-end``` with scrolling because it will break it, try to use ```margin-top: auto``` instead
    - Remember to set ```height``` for scrolling element
