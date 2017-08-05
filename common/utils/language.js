

export function pluralize(num, captions) {
  let format = null;
  if (0 === num || 1 === num) {
    format = captions[String(num)];
  } else {
    format = captions['*'];
  }
  return format.replace('%d', String(num));
}
