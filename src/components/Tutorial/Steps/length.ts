let length = 0;

export function increment(num = 1) {
  length += num;
}

export function get() {
  return length;
}
