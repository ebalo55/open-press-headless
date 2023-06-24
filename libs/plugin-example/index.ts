// Import the module from the src folder and export it as default entrypoint
import { PluginExampleModule } from "./src";

export default PluginExampleModule;

// Optionally (but suggested) also re-export all the modules and utilities from the src folder in order to enhance
// the developer experience
export * from "./src";
