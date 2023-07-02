import {
	makeRandomString,
	TEMPLATE_SERVICE_EVENTS,
	TemplateDocument,
	TemplateService,
	TemplateServiceCreationAfterEvent,
	TemplateServiceUpdateAfterEvent,
} from "@aetheria/common";
import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { minify } from "html-minifier";
import * as jsdom from "jsdom";
import { spawn } from "node:child_process";
import { unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd } from "node:process";

@Injectable()
export class PluginTailwindClassesBuilderService {
	private _stats = {
		css_starting_size: 0,
		html_starting_size: 0,
		scripts_starting_size: 0,
	};

	constructor(private _template_service: TemplateService) {}

	@OnEvent(TEMPLATE_SERVICE_EVENTS.creation_after)
	@OnEvent(TEMPLATE_SERVICE_EVENTS.update_after)
	public async handleTemplateUpdateOrCreation(
		payload: TemplateServiceCreationAfterEvent | TemplateServiceUpdateAfterEvent
	): Promise<void> {
		this.startStatsLogger(payload);

		const generated_css = await this.runTailwindCSSGeneration(payload);
		await this.runCssMinification(payload, generated_css);
		await this.runHtmlMinification(payload);
		await payload.document.save();

		await this.endStatsLogger(payload);
	}

	private endStatsLogger(payload: TemplateServiceCreationAfterEvent | TemplateServiceUpdateAfterEvent) {
		Logger.log(
			`Finished building and optimizing CSS, generation resulted in a ${payload.document.css.length} bytes CSS, ` +
				`${payload.document.html.length} bytes HTML and ${
					payload.document.extra?.scripts?.length || 0
				} bytes of scripts`,
			"PluginTailwindClassesBuilderService"
		);

		const css_size_difference = this._stats.css_starting_size - payload.document.css.length;
		const html_size_difference = this._stats.html_starting_size - payload.document.html.length;
		const scripts_size_difference =
			this._stats.scripts_starting_size - (payload.document.extra?.scripts?.length || 0);

		const css_reduction_percentage = ((css_size_difference / this._stats.css_starting_size) * 100).toFixed(2);
		const html_reduction_percentage = ((html_size_difference / this._stats.html_starting_size) * 100).toFixed(2);
		const scripts_reduction_percentage = (
			(scripts_size_difference / (this._stats.scripts_starting_size || 1)) *
			100
		).toFixed(2);

		Logger.log(
			`CSS size reduced by ${css_size_difference} bytes (${css_reduction_percentage}%)`,
			"PluginTailwindClassesBuilderService"
		);
		Logger.log(
			`HTML size reduced by ${html_size_difference} bytes (${html_reduction_percentage}%)`,
			"PluginTailwindClassesBuilderService"
		);
		Logger.log(
			`Scripts size reduced by ${scripts_size_difference} bytes (${scripts_reduction_percentage}%)`,
			"PluginTailwindClassesBuilderService"
		);

		const total_size_difference = css_size_difference + html_size_difference + scripts_size_difference;
		const total_reduction_percentage = (
			(total_size_difference /
				(this._stats.css_starting_size + this._stats.html_starting_size + this._stats.scripts_starting_size)) *
			100
		).toFixed(2);

		Logger.log(
			`Total size reduced by ${total_size_difference} bytes (${total_reduction_percentage}%)`,
			"PluginTailwindClassesBuilderService"
		);
	}

	/**
	 * Store the sizes of the initial css and html
	 * @param {TemplateServiceCreationAfterEvent | TemplateServiceUpdateAfterEvent} payload
	 * @private
	 */
	private startStatsLogger(payload: TemplateServiceCreationAfterEvent | TemplateServiceUpdateAfterEvent) {
		this._stats = {
			css_starting_size: payload.document.css.length,
			html_starting_size: payload.document.html.length,
			scripts_starting_size: payload.document.extra?.scripts?.length || 0,
		};
	}

	/**
	 * Run the steps responsible for the minification of the merged css
	 * @param {TemplateServiceCreationAfterEvent | TemplateServiceUpdateAfterEvent} payload
	 * @param {string} generated_css
	 * @returns {Promise<void>}
	 * @private
	 */
	private async runCssMinification(
		payload: TemplateServiceCreationAfterEvent | TemplateServiceUpdateAfterEvent,
		generated_css: string
	) {
		Logger.log("Merging styles", "PluginTailwindClassesBuilderService");

		// load tailwind classes first in order to allow any override, then load the document css and finally the html
		// styles
		const css = this.mergeStyles([
			generated_css,
			payload.document.css,
			...this.extractStyles(payload.document.html),
		]);

		Logger.debug(`Total css length ${css.length} bytes`, "PluginTailwindClassesBuilderService");
		this._stats.css_starting_size = css.length;

		Logger.log("Minifying CSS", "PluginTailwindClassesBuilderService");

		const css_filename = await this.makeTempCss(css);
		payload.document.css = await this.minifyCss(css_filename);
		await unlink(css_filename);

		Logger.debug(
			`Total minified css length ${payload.document.css.length} bytes`,
			"PluginTailwindClassesBuilderService"
		);
	}

	/**
	 * Strip all comments from the css
	 * @param css The css to strip the comments from
	 * @private
	 */
	private stripCSSComments(css: string) {
		return css.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "");
	}

	/**
	 * Run the steps to build the tailwind classes
	 * @param {TemplateServiceCreationAfterEvent | TemplateServiceUpdateAfterEvent} payload The payload of the event
	 * @returns {Promise<string>} A promise that resolves when the tailwind classes are built and returns the css
	 * @private
	 */
	private async runTailwindCSSGeneration(
		payload: TemplateServiceCreationAfterEvent | TemplateServiceUpdateAfterEvent
	) {
		Logger.log("Building Tailwind CSS classes", "PluginTailwindClassesBuilderService");
		const template_filename = await this.makeTempHtml(payload.document);

		const generated_css = await this.buildTailwindClasses(template_filename);
		await unlink(template_filename);

		Logger.debug(`Total generated css length ${generated_css.length} bytes`, "PluginTailwindClassesBuilderService");

		return generated_css;
	}

	/**
	 * Run the steps to minify the html
	 * @param {TemplateServiceCreationAfterEvent | TemplateServiceUpdateAfterEvent} payload The payload of the event
	 * @returns {Promise<void>} A promise that resolves when the html minification is done
	 * @private
	 */
	private async runHtmlMinification(payload: TemplateServiceCreationAfterEvent | TemplateServiceUpdateAfterEvent) {
		Logger.log("Minifying HTML", "PluginTailwindClassesBuilderService");
		Logger.debug(`Total html length ${payload.document.html.length} bytes`, "PluginTailwindClassesBuilderService");

		const html = this.minifyHtml(this.removeStyleTags(payload.document.html));

		Logger.log("Extracting scripts", "PluginTailwindClassesBuilderService");
		const { scripts, cleaned_html } = this.extractScripts(html);

		payload.document.html = cleaned_html;
		payload.document.extra = {
			...payload.document.extra,
			scripts,
		};

		Logger.debug(
			`Total minified html length ${payload.document.html.length} bytes`,
			"PluginTailwindClassesBuilderService"
		);
		Logger.debug(
			`Extracted and minified scripts length ${payload.document.extra.scripts.length} bytes`,
			"PluginTailwindClassesBuilderService"
		);
	}

	/**
	 * Extract all the script tags from the html and return the scripts and the html without the script tags
	 * @param {string} html The html to extract the scripts from
	 * @returns {{scripts: string, cleaned_html: string}} The scripts and the html without the script tags
	 * @private
	 */
	private extractScripts(html: string): { scripts: string; cleaned_html: string } {
		let scripts = "";

		const dom = new jsdom.JSDOM(html);
		dom.window.document.querySelectorAll("script").forEach((script) => {
			scripts += `;${script.innerHTML}`;
			script.remove();
		});

		return {
			scripts,
			cleaned_html: dom.window.document.body.outerHTML,
		};
	}

	/**
	 * Remove all style tags from the html and return the html without the style tags.
	 * @param {string} html The html to remove the style tags from
	 * @returns {string} The html without the style tags
	 * @private
	 */
	private removeStyleTags(html: string): string {
		return html.replace(/<style[\s\S]*?<\/style>/gm, "");
	}

	/**
	 * Minify the html using html-minifier and return the minified html.
	 * Defaults to the most aggressive minification.
	 * @param {string} html The html to minify
	 * @returns {string} The minified html
	 * @private
	 */
	private minifyHtml(html: string): string {
		return minify(html, {
			caseSensitive: false,
			collapseBooleanAttributes: true,
			collapseInlineTagWhitespace: true,
			collapseWhitespace: true,
			continueOnParseError: true,
			decodeEntities: true,
			keepClosingSlash: true,
			minifyCSS: true,
			minifyJS: true,
			minifyURLs: true,
			preserveLineBreaks: false,
			removeAttributeQuotes: true,
			removeComments: true,
			removeEmptyAttributes: false,
			removeEmptyElements: false,
			removeRedundantAttributes: false,
			removeScriptTypeAttributes: false,
			removeStyleLinkTypeAttributes: false,
			removeTagWhitespace: true,
			sortAttributes: true,
			sortClassName: true,
			useShortDoctype: true,
		});
	}

	private async minifyCss(filename: string): Promise<string> {
		return new Promise((resolve, reject) => {
			let minified_css = "";

			const child = spawn("npx", ["postcss", filename, "-u", "cssnano", "-u", "autoprefixer", "--no-map"], {
				cwd: cwd(),
			});

			// intercept stdout aka the generated css
			child.stdout.on("data", (data) => {
				minified_css += data.toString();
			});

			child.stderr.on("data", (data) => {
				Logger.warn(data.toString(), "PluginTailwindClassesBuilderService");
			});

			// log errors and fail if the child process fails
			/* istanbul ignore next */
			child.on("error", (err) => {
				Logger.error(err?.message, "PluginTailwindClassesBuilderService");
				reject(err);
			});

			// resolve the promise if the child process exits successfully
			child.on("close", (code) => {
				/* istanbul ignore else */
				if (code === 0) {
					resolve(this.stripCSSComments(minified_css));
				} else {
					reject(code);
				}
			});
		});
	}

	/**
	 * Merge the styles from the given html with the given styles.
	 * @param {string[]} styles The styles to merge.
	 * @returns {string} The merged styles.
	 * @private
	 */
	private mergeStyles(styles: string[]): string {
		return styles.join("");
	}

	/**
	 * Extracts the styles tag from the given html.
	 * @param {string} html The html to extract the styles from.
	 * @returns {string[]} The extracted styles.
	 * @private
	 */
	private extractStyles(html: string): string[] {
		const style_regex = /<style([\s\S]*?)<\/style>/gm;
		const matches = html.matchAll(style_regex);
		const styles = [];
		for (const match of matches) {
			styles.push(match[1]);
		}

		return styles;
	}

	/**
	 * Builds the tailwind classes for the given filename.
	 * @param {string} filename The filename to build the tailwind classes for.
	 * @returns {Promise<string>} The generated css.
	 */
	private buildTailwindClasses(filename: string): Promise<string> {
		return new Promise((resolve, reject) => {
			let generated_css = "";

			const child = spawn("npx", ["tailwindcss", "build", "-i", "./tailwind.css", "--content", filename, "-m"], {
				cwd: cwd(),
			});

			// intercept stdout aka the generated css
			child.stdout.on("data", (data) => {
				generated_css += data.toString();
			});

			child.stderr.on("data", (data) => {
				Logger.warn(data.toString(), "PluginTailwindClassesBuilderService");
			});

			// log errors and fail if the child process fails
			/* istanbul ignore next */
			child.on("error", (err) => {
				Logger.error(err?.message, "PluginTailwindClassesBuilderService");
				reject(err);
			});

			// resolve the promise if the child process exits successfully
			child.on("close", (code) => {
				/* istanbul ignore else */
				if (code === 0) {
					resolve(generated_css);
				} else {
					reject(code);
				}
			});
		});
	}

	/**
	 * Creates a new template with a temporary name and the templated html.
	 * @param {TemplateDocument} template The template to create.
	 * @returns {Promise<string>} The path to the temporary html file.
	 * @private
	 */
	private async makeTempHtml(template: TemplateDocument): Promise<string> {
		const html = `<html><head><style>${template.css}</style></head>${template.html}</html>`;
		const filename = resolve("/tmp", `${makeRandomString(32)}.html`);

		await writeFile(filename, html);
		return filename;
	}

	/**
	 * Creates a new temporary css file with the given css.
	 * @param css The css to write to the file.
	 * @returns {Promise<string>} The path to the temporary css file.
	 */
	private async makeTempCss(css: string): Promise<string> {
		const filename = resolve("/tmp", `${makeRandomString(32)}.css`);

		await writeFile(filename, css);
		return filename;
	}
}
