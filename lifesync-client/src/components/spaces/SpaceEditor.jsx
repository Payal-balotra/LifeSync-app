import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import {
  randomColor,
  getCaretCoordinates,
  drawSelection,
} from "../../lib/utils";
import useAuthStore from "../../store/authStore";


export default function SpaceEditor({ spaceId ,role ,canEdit}) {
  const { user } = useAuthStore();
  const textareaRef = useRef(null);
  const cursorLayerRef = useRef(null);
  const lastValueRef = useRef("");
  const colorRef = useRef(randomColor());
  const clearEditorRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!spaceId || !textareaRef.current || !user) return;
    if(!canEdit)return;
    let typingTimeout = null;

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      spaceId,
      ydoc
    );

    const yText = ydoc.getText("editor");
    const awareness = provider.awareness;
    const textarea = textareaRef.current;

    /* ---------------- LOCAL USER ---------------- */
    awareness.setLocalState({
      user: {
        id: user._id,
        name: user.name,
        color: colorRef.current,
      },
    });

    /* ---------------- YJS → TEXTAREA ---------------- */
    const updateTextarea = () => {
      const yValue = yText.toString();
      if (textarea.value !== yValue) {
        textarea.value = yValue;
        lastValueRef.current = yValue;
      }
    };

    yText.observe(updateTextarea);

    /* ---------------- TEXTAREA → YJS ---------------- */
    const onInput = () => {
      const newValue = textarea.value;
      const oldValue = lastValueRef.current;

      let start = 0;
      while (
        start < newValue.length &&
        start < oldValue.length &&
        newValue[start] === oldValue[start]
      ) {
        start++;
      }

      if (oldValue.length > start) {
        yText.delete(start, oldValue.length - start);
      }

      if (newValue.length > start) {
        yText.insert(start, newValue.slice(start));
      }

      lastValueRef.current = newValue;

      // typing awareness
      awareness.setLocalStateField("typing", true);
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        awareness.setLocalStateField("typing", false);
      }, 1000);
    };

    textarea.addEventListener("input", onInput);

    /* ---------------- CURSOR AWARENESS ---------------- */
    const sendCursor = () => {
      awareness.setLocalStateField("cursor", {
        position: textarea.selectionStart,
      });
      awareness.setLocalStateField("selection", {
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
      });
    };

    textarea.addEventListener("keyup", sendCursor);
    textarea.addEventListener("click", sendCursor);

    /* ---------------- AWARENESS RENDER ---------------- */
    const onAwarenessChange = () => {
      const layer = cursorLayerRef.current;
      if (!layer) return;

      layer.innerHTML = "";

      const localClientId = awareness.clientID;
      const activeTypingUsers = [];

      awareness.getStates().forEach((state, clientId) => {
        if (!state.user) return;

        // collect typing users (except me)
        if (clientId !== localClientId && state.typing && state.user.name) {
          activeTypingUsers.push(state.user.name);
        }

        // render cursor (except me)
        if (!state.cursor || clientId === localClientId) return;

        if (state.selection) {
          drawSelection(
            layer,
            textarea,
            state.selection.start,
            state.selection.end,
            state.user.color
          );
        }
        if (!state.cursor) return;

        const { position } = state.cursor;
        const { x, y } = getCaretCoordinates(textarea, position);

        const cursor = document.createElement("div");
        cursor.style.position = "absolute";
        cursor.style.left = `${x + textarea.offsetLeft}px`;
        cursor.style.top = `${y + textarea.offsetTop - textarea.scrollTop}px`;
        cursor.style.width = "2px";
        cursor.style.height = "20px";
        cursor.style.background = state.user.color;

        const label = document.createElement("div");
        label.textContent = state.user.name;
        label.style.position = "absolute";
        label.style.top = "-16px";
        label.style.left = "0";
        label.style.background = state.user.color;
        label.style.color = "#fff";
        label.style.fontSize = "10px";
        label.style.padding = "2px 4px";
        label.style.borderRadius = "4px";
        label.style.whiteSpace = "nowrap";

        cursor.appendChild(label);
        layer.appendChild(cursor);
      });

      setTypingUsers(activeTypingUsers);
    };

    awareness.on("change", onAwarenessChange);
      // Clear Editor Logic
    clearEditorRef.current = () => {
      yText.delete(0, yText.length);
    };

    return () => {
      textarea.removeEventListener("input", onInput);
      textarea.removeEventListener("keyup", sendCursor);
      textarea.removeEventListener("click", sendCursor);
      yText.unobserve(updateTextarea);
      awareness.off("change", onAwarenessChange);
      provider.destroy();
      ydoc.destroy();
    };
  }, [spaceId, user]);

  return (
   <div className="relative w-full h-full flex flex-col">
  
  {/* 🔵 TYPING INDICATOR */}
  {typingUsers.length > 0 && (
    <div className="absolute top-0 left-0 w-full text-sm text-gray-500 px-2 py-1 bg-white z-10">
      {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
    </div>
  )}

  {/* EDITOR */}
  <textarea
    ref={textareaRef}
    disabled={!canEdit}
     className={`w-full h-full border p-4 rounded resize-none ${
    !canEdit ? "bg-gray-50 cursor-not-allowed" : ""
  }`}
  placeholder={
    canEdit
      ? "Start typing..."
      : "You have read-only access"
  }
  />

  {/* cursor overlay */}
  <div
    ref={cursorLayerRef}
    className="absolute inset-0 pointer-events-none"
  />

  {/* INFO + ACTION BAR */}
  <div className="flex items-center justify-between gap-4 text-xs text-gray-500 bg-gray-50 border-t border-gray-200 px-3 py-2">
    <p className="leading-relaxed">
      ✨ This editor is optimized for live sessions, helping teams think and write together in the moment.
    </p>
{canEdit && (
    <button
      className="shrink-0 text-xs font-medium text-red-200 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition cursor-pointer bg-red-500"
      onClick={()=>clearEditorRef.current?.()}
    >
      Clear editor
    </button>
)}
  </div>

</div>

  );
}
