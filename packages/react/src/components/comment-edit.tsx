import useSWRMutation from "swr/mutation";
import { PencilIcon } from "lucide-react";
import { cn } from "../utils/cn";
import { editComment, getCommentsKey } from "../utils/fetcher";
import { useCommentContext } from "../contexts/comment";
import { updateComment } from "../utils/comment-manager";
import { buttonVariants } from "./button";
import { CommentEditor, useCommentEditor } from "./editor";
import { Spinner } from "./spinner";

export function CommentEdit(): JSX.Element {
  const [editor, setEditor] = useCommentEditor();
  const { comment, editorRef, setEdit } = useCommentContext();

  if (editor) editorRef.current = editor.editor;
  const mutation = useSWRMutation(
    getCommentsKey(comment.threadId),
    (_, { arg }: { arg: { id: number; content: string } }) => editComment(arg)
  );

  const onClose = (): void => {
    setEdit(false);
  };

  const submit = (): void => {
    if (!editor) return;
    const content = editor.getValue();

    if (content.length === 0) return;
    void mutation.trigger(
      { id: comment.id, content },
      {
        revalidate: false,
        onSuccess: () => {
          updateComment(comment.id, (c) => ({ ...c, content }));
          onClose();
        },
      }
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    submit();
    e.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <CommentEditor
        defaultValue={comment.content}
        disabled={mutation.isMutating}
        editor={editor}
        onChange={setEditor}
        onEscape={onClose}
        onSubmit={submit}
        placeholder="Edit Message"
        variant="secondary"
      />
      <div className="fc-mt-2 fc-flex fc-flex-row fc-gap-1">
        <button
          aria-label="Edit"
          className={cn(
            buttonVariants({ variant: "primary", className: "fc-gap-2" })
          )}
          disabled={mutation.isMutating || (editor?.isEmpty ?? true)}
          type="submit"
        >
          {mutation.isMutating ? (
            <Spinner />
          ) : (
            <PencilIcon className="fc-h-4 fc-w-4" />
          )}
          Edit
        </button>
        <button
          className={cn(buttonVariants({ variant: "secondary" }))}
          onClick={onClose}
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
