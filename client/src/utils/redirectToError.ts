import { useRouter } from "next/router";

const router = useRouter();

export function redirectToErrorPage(errorCode: number, errorMessage: string) {
  router.push(`/error?code=${errorCode}&message=${errorMessage}`);
}
