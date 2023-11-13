import { useRouter } from "next/router";

// TODO: This code will not work with the rules of hooks.
// eslint-disable-next-line react-hooks/rules-of-hooks
const router = useRouter();

export function redirectToErrorPage(errorCode: number, errorMessage: string) {
  router.push(`/error?code=${errorCode}&message=${errorMessage}`);
}
