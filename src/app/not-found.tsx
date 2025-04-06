import { redirect } from "next/navigation";

export default async function NotFound() {
  redirect("/events");
  return (
    <div className="flex flex-col items-center justify-center gap-10 font-bold">
      <h2 className="text-5xl">404</h2>
      <p>잘못된 접근입니다.</p>
    </div>
  );
}
