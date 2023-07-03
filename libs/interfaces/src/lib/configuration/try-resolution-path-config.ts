export interface TryResolutionPathConfig {
	/**
	 * The filename to try to resolve
	 */
	filename: string;
	/**
	 * The path to the plugins resolution directory, if not given, the current working directory is used
	 */
	resolution_path?: string;
	/**
	 * If true, the parent directory of the path specified in the configuration file is tried to resolve
	 */
	enable_node_modules?: boolean;
	/**
	 * If true, the plugin identifier relative to the node_modules directory is tried to resolve
	 */
	enable_parent?: boolean;
}
