import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { DATABASE_CONNECTIONS } from "@open-press/config";
import { DateTime } from "luxon";
import { sanitizeFilter } from "mongoose";
import { TEMPLATE_SERVICE_EVENTS } from "./constants";
import { TemplateNameAlreadyUsedErrorFactory, TemplateNotFoundErrorFactory } from "./errors";
import {
	TemplateServiceCreationAfterEvent,
	TemplateServiceCreationBeforeEvent,
	TemplateServiceDeleteAfterEvent,
	TemplateServiceDeleteBeforeEvent,
	TemplateServiceFindAfterEvent,
	TemplateServiceFindAllAfterEvent,
	TemplateServiceFindAllBeforeEvent,
	TemplateServiceFindBeforeEvent,
	TemplateServiceFindByNameAfterEvent,
	TemplateServiceFindByNameBeforeEvent,
	TemplateServiceUpdateAfterEvent,
	TemplateServiceUpdateBeforeEvent,
} from "./events";
import { CreateTemplateDTO, UpdateTemplateDTO } from "./template.dto";
import { Template, TemplateDocument, TemplateModel } from "./template.schema";

interface ITemplateID {
	template_id: string;
}

@Injectable()
export class TemplateService {
	constructor(
		@InjectModel(Template.name, DATABASE_CONNECTIONS.default) private readonly model: TemplateModel,
		private readonly _event_emitter: EventEmitter2
	) {}

	/**
	 * Create a new template.
	 * @param {CreateTemplateDTO} template - Template to create.
	 * @returns {Promise<TemplateDocument>} - Created template.
	 */
	public async create(template: CreateTemplateDTO): Promise<TemplateDocument> {
		await this._event_emitter.emitAsync(TEMPLATE_SERVICE_EVENTS.creation_before, {
			template,
		} as TemplateServiceCreationBeforeEvent);

		if (await this.exists(template.name)) {
			throw TemplateNameAlreadyUsedErrorFactory.make();
		}

		let document = new this.model(template);
		document.created_at = document.updated_at = DateTime.now();

		document = await document.save();
		await this._event_emitter.emitAsync(TEMPLATE_SERVICE_EVENTS.creation_after, {
			document,
		} as TemplateServiceCreationAfterEvent);
		return document;
	}

	/**
	 * Update a template.
	 * @param {string | TemplateDocument} template - Template to update.
	 * @param {UpdateTemplateDTO} update - Update to apply.
	 * @returns {Promise<TemplateDocument>} - Updated template.
	 */
	public async update(template: string | TemplateDocument, update: UpdateTemplateDTO): Promise<TemplateDocument> {
		await this._event_emitter.emitAsync(TEMPLATE_SERVICE_EVENTS.update_before, {
			template_id: this.getTemplateId(template, false),
			template: update,
		} as TemplateServiceUpdateBeforeEvent);

		// if the template is a string, we need to find it
		// internally handled the case the template id is invalid
		if (this.isTemplateIdentifier(template)) {
			template = await this.find(template);
		}

		// if the update has a name and it's not the same as the template's name, check if it exists
		if (update.name && template.name !== update.name && (await this.exists(update.name))) {
			throw TemplateNameAlreadyUsedErrorFactory.make();
		}

		template.$set(update);
		template.updated_at = DateTime.now();

		template = await template.save();
		await this._event_emitter.emitAsync(TEMPLATE_SERVICE_EVENTS.update_after, {
			document: template,
		} as TemplateServiceUpdateAfterEvent);
		return template;
	}

	/**
	 * Delete a template.
	 * @param {string | TemplateDocument} template - Template to delete.
	 * @returns {Promise<TemplateDocument>} - Deleted template.
	 */
	public async delete(template: string | TemplateDocument): Promise<TemplateDocument> {
		await this._event_emitter.emitAsync(
			TEMPLATE_SERVICE_EVENTS.delete_before,
			this.getTemplateId(template, true) as TemplateServiceDeleteBeforeEvent
		);

		// if the template is a string, we need to find it
		// internally handled the case the template id is invalid
		if (this.isTemplateIdentifier(template)) {
			template = await this.find(template);
		}

		template = await template.deleteOne();
		await this._event_emitter.emitAsync(TEMPLATE_SERVICE_EVENTS.delete_after, {
			document: template,
		} as TemplateServiceDeleteAfterEvent);
		return template;
	}

	/**
	 * Find a template by its name.
	 * @param {string} name - Template name to find.
	 * @returns {Promise<TemplateDocument>} - Found template.
	 */
	public async findByName(name: string): Promise<TemplateDocument> {
		await this._event_emitter.emitAsync(TEMPLATE_SERVICE_EVENTS.find_by_name_before, {
			name,
		} as TemplateServiceFindByNameBeforeEvent);

		const document = await this.model.findOne(sanitizeFilter({ name }));

		if (document) {
			await this._event_emitter.emitAsync(TEMPLATE_SERVICE_EVENTS.find_by_name_after, {
				document,
			} as TemplateServiceFindByNameAfterEvent);

			return document;
		}

		throw TemplateNotFoundErrorFactory.make();
	}

	/**
	 * Find all templates.
	 * @returns {Promise<TemplateDocument[]>} - Found templates.
	 */
	public async findAll(): Promise<TemplateDocument[]> {
		await this._event_emitter.emitAsync(
			TEMPLATE_SERVICE_EVENTS.find_all_before,
			{} as TemplateServiceFindAllBeforeEvent
		);

		const documents = await this.model.find();
		await this._event_emitter.emitAsync(TEMPLATE_SERVICE_EVENTS.find_all_after, {
			documents,
		} as TemplateServiceFindAllAfterEvent);
		return documents;
	}

	/**
	 * Find a template by its id.
	 * @param {string} template - Template id to find.
	 * @returns {Promise<TemplateDocument>} - Found template.
	 */
	public async find(template: string): Promise<TemplateDocument> {
		await this._event_emitter.emitAsync(
			TEMPLATE_SERVICE_EVENTS.find_before,
			this.getTemplateId(template, true) as TemplateServiceFindBeforeEvent
		);

		const document = await this.model.findById(template);

		if (document) {
			await this._event_emitter.emitAsync(TEMPLATE_SERVICE_EVENTS.find_after, {
				document,
			} as TemplateServiceFindAfterEvent);

			return document;
		}

		throw TemplateNotFoundErrorFactory.make();
	}

	/**
	 * Check if a template name is already used.
	 * @param {string} name - Template name to check.
	 * @returns {Promise<boolean>} - True if the template name is already used, false otherwise.
	 * @private
	 */
	private async exists(name: string): Promise<boolean> {
		return (await this.model.exists(sanitizeFilter({ name }))) !== null;
	}

	/**
	 * Get the template id.
	 * @param {string | TemplateDocument} template - Template to get the id from.
	 * @param as_object - If true, return the template id as an object id, otherwise as a string.
	 * @returns {string} - Template id.
	 * @private
	 */
	private getTemplateId(template: string | TemplateDocument, as_object: true): ITemplateID;
	private getTemplateId(template: string | TemplateDocument, as_object: false): string;
	private getTemplateId(template: string | TemplateDocument, as_object: boolean): string | ITemplateID;
	private getTemplateId(template: string | TemplateDocument, as_object: boolean): string | ITemplateID {
		if (as_object) {
			return this.isTemplateIdentifier(template)
				? { template_id: template }
				: { template_id: template._id.toHexString() };
		}

		return this.isTemplateIdentifier(template) ? template : template._id.toHexString();
	}

	/**
	 * Check if a template is a string.
	 * @param {string | TemplateDocument | null} template - Template to check.
	 * @returns {template is string} - True if the template is a string, false otherwise.
	 * @private
	 */
	private isTemplateIdentifier(template: string | TemplateDocument | null): template is string {
		return typeof template === "string";
	}
}
