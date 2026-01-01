import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}


export  function randomColor (){
    return  "#" + Math.floor(Math.random() * 16777215).toString(16);

}

export  function getCaretCoordinates(textarea, position) {
  const div = document.createElement("div");
  const style = getComputedStyle(textarea);

  for (const prop of style) {
    div.style[prop] = style[prop];
  }

  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.wordWrap = "break-word";

  div.textContent = textarea.value.substring(0, position);

  const span = document.createElement("span");
  span.textContent = "|";
  div.appendChild(span);

  document.body.appendChild(div);

  const { offsetLeft, offsetTop } = span;

  document.body.removeChild(div);

  return { x: offsetLeft, y: offsetTop };
}
export function drawSelection(layer, textarea, start, end, color) {
  if (start === end) return;

  const startPos = getCaretCoordinates(textarea, start);
  const endPos = getCaretCoordinates(textarea, end);

  const selection = document.createElement("div");
  selection.style.position = "absolute";
  selection.style.left = `${startPos.x + textarea.offsetLeft}px`;
  selection.style.top = `${startPos.y + textarea.offsetTop - textarea.scrollTop}px`;
  selection.style.width = `${Math.max(6, endPos.x - startPos.x)}px`;
  selection.style.height = "20px";
  selection.style.background = color;
  selection.style.opacity = "0.25";
  selection.style.borderRadius = "3px";

  layer.appendChild(selection);
}

export function formatActivity(activity) {
  const map = {
    task_created: `created task "${activity.meta?.title}"`,
    task_archived: `archived task "${activity.meta?.title}"`,
    role_changed: `changed a role`,
    member_added: `added a member`,
  };

  return map[activity.action] || activity.action.replace("_", " ");
}

