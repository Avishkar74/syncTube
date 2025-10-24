import Button from '../ui/Button';

export default function CreateRoomButton({ onCreate }) {
  return (
    <Button onClick={onCreate || (() => {/* TODO */})}>
      Create Room
    </Button>
  );
}
