import {
	type ExtensionAPI,
	type ExtensionCommandContext,
	type SessionEntry,
	sessionEntryToContextMessages,
} from "@earendil-works/pi-coding-agent";

const MARKER_TYPE = "context-clear";

function hasConversationContext(entries: SessionEntry[]): boolean {
	return entries.some((entry) => sessionEntryToContextMessages(entry).length > 0);
}

function canNavigateBefore(entry: SessionEntry): boolean {
	return (entry.type === "message" && entry.message.role === "user") || entry.type === "custom_message";
}

function findEmptyContextTarget(ctx: ExtensionCommandContext, currentLeafId: string | null): SessionEntry | undefined {
	return ctx.sessionManager.getEntries().find((entry) => {
		if (entry.id === currentLeafId || !canNavigateBefore(entry)) return false;

		const parentBranch = entry.parentId === null ? [] : ctx.sessionManager.getBranch(entry.parentId);
		return !hasConversationContext(parentBranch);
	});
}

export default function clearContextExtension(pi: ExtensionAPI): void {
	pi.registerCommand("clear", {
		description: "Clear context and preserve session history",
		handler: async (args, ctx) => {
			if (args.trim()) {
				ctx.ui.notify("Usage: /clear", "warning");
				return;
			}

			if (!ctx.isIdle()) {
				ctx.ui.notify("Wait for the current response to finish before clearing context.", "warning");
				return;
			}

			if (!hasConversationContext(ctx.sessionManager.buildContextEntries())) {
				ctx.ui.notify("Context is already empty.", "info");
				return;
			}

			const oldLeafId = ctx.sessionManager.getLeafId();
			const target = findEmptyContextTarget(ctx, oldLeafId);
			if (!target) {
				ctx.ui.notify("Cannot find a session point with empty context.", "error");
				return;
			}

			try {
				const result = await ctx.navigateTree(target.id, { summarize: false });
				if (result.cancelled) return;

				ctx.ui.setEditorText("");
				pi.appendEntry(MARKER_TYPE, { fromId: oldLeafId });
				ctx.ui.notify("Context cleared. History is available in /tree.", "info");
			} catch (error) {
				ctx.ui.notify(error instanceof Error ? error.message : String(error), "error");
			}
		},
	});
}
