let prev = 0;

export default function newUID() {
  prev++;
  return prev;
}
