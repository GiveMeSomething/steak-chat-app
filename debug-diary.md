
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