import type { Editor } from "@tiptap/react";
import { useLayoutEffect, useState } from "react";
import { cn } from "../../utils/cn";
import { inputVariants } from "../input";
import { buttonVariants } from "../button";

export function HyperLink({
	editor,
	onClose,
}: {
	editor: Editor;
	onClose: () => void;
}): React.ReactElement {
	const [name, setName] = useState("");
	const [value, setValue] = useState("");

	useLayoutEffect(() => {
		editor.commands.extendMarkRange("link");

		const href = editor.getAttributes("link").href as string | undefined;
		const selection = editor.state.selection;
		const selected = editor.state.doc.textBetween(selection.from, selection.to);

		setName(selected);
		setValue(href ?? "");
	}, [editor]);

	return (
		<form
			className="flex flex-col gap-4"
			onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();
				e.stopPropagation();

				if (value.trim().length === 0) return;
				const content = name.length > 0 ? name : value;

				onClose();
				if (!editor.state.selection.empty) {
					editor
						.chain()
						.deleteSelection()
						.setLink({ href: value })
						.insertContent(content)
						.focus()
						.run();
				} else {
					editor
						.chain()
						.setLink({ href: value })
						.insertContent(content)
						.unsetMark("link")
						.insertContent(" ")
						.focus()
						.run();
				}
			}}
		>
			<div className="grid grid-cols-[auto_1fr] gap-4">
				<label className="font-medium text-sm content-center" htmlFor="name">
					Name
				</label>
				<input
					id="name"
					className={cn(inputVariants(), "flex-1")}
					value={name}
					onChange={(e) => {
						setName(e.target.value);
					}}
					placeholder="My Link (optional)"
				/>
				<label className="font-medium text-sm content-center" htmlFor="url">
					URL
				</label>
				<input
					id="url"
					className={cn(inputVariants(), "flex-1")}
					onChange={(e) => {
						setValue(e.target.value);
					}}
					placeholder="https://example.com"
					required
					type="url"
					value={value}
				/>
			</div>
			<div className="flex gap-1">
				<button className={cn(buttonVariants())} type="submit">
					Save
				</button>
				{editor.isActive("link") ? (
					<button
						className={cn(buttonVariants({ variant: "secondary" }))}
						onClick={() => {
							onClose();
							editor.chain().focus().unsetMark("link").run();
						}}
						type="button"
					>
						Unset
					</button>
				) : null}
			</div>
		</form>
	);
}
