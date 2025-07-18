import dynamic from "next/dynamic";

const UpdatePasswordClient = dynamic(() => import("./UpdatePasswordClient"), {
  ssr: false,
});

export default function UpdatePasswordPage() {
  return <UpdatePasswordClient />;
}
