/**
 * @description This object contains the event names that are emitted by the TemplateController.
 */
export const TEMPLATE_SERVICE_EVENTS = {
	creation_before: "hook.template.creation.before",
	creation_after: "hook.template.creation.after",
	update_before: "hook.template.update.before",
	update_after: "hook.template.update.after",
	delete_before: "hook.template.delete.before",
	delete_after: "hook.template.delete.after",
	find_all_before: "hook.template.find_all.before",
	find_all_after: "hook.template.find_all.after",
	find_before: "hook.template.find.before",
	find_after: "hook.template.find.after",
	find_by_name_before: "hook.template.find_by_name.before",
	find_by_name_after: "hook.template.find_by_name.after",
} as const;
